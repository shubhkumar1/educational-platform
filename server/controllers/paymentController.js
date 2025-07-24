import { Cashfree } from 'cashfree-pg';
import { v4 as uuidv4 } from 'uuid';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// Initialize Cashfree
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = "sandbox"; // Use SANDBOX for testing

/**
 * @desc    Create a Cashfree payment session
 * @route   POST /api/payment/create-order
 */
export const createPaymentOrder = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    try {
        const { amount } = req.body;
        const orderId = `ORDER_${uuidv4()}`;

        const request = {
            order_amount: amount,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: userId.toString(),
                customer_email: user.email,
                customer_phone: "9999999999", // A placeholder phone number
            },
            order_meta: {
                return_url: `http://localhost:5173/order/status?order_id={order_id}`,
            }
        };

        const response = await Cashfree.PGCreateOrder("2022-09-01", request);
        
        // Create a transaction record in our database
        await Transaction.create({
            userId: userId,
            orderId: orderId,
            amount: amount,
            status: 'Pending',
        });

        // Send the session ID to the frontend
        res.json(response.data);

    } catch (error) {
        console.error('Cashfree Error:', error.response.data);
        res.status(500).json({ message: 'Failed to create payment order.' });
    }
};

/**
 * @desc    Check the status of a payment after completion
 * @route   POST /api/payment/status
 */
export const checkPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.body;
        const response = await Cashfree.PGOrderFetchPayments("2022-09-01", orderId);

        const payment = response.data[0];

        if (payment.payment_status === "SUCCESS") {
            await Transaction.findOneAndUpdate({ orderId }, {
                status: 'Success',
                transactionId: payment.cf_payment_id
            });
            // Here you would also update the user's subscription status in your database
        } else {
            await Transaction.findOneAndUpdate({ orderId }, { status: 'Failed' });
        }

        res.json({ status: payment.payment_status });

    } catch (error) {
        console.error('Cashfree Status Check Error:', error);
        res.status(500).json({ message: 'Failed to verify payment status.' });
    }
};