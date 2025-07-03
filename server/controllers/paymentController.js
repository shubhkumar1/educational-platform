import Paytm from 'paytm-pg-node-sdk'; // Assumes this is the SDK import
import { v4 as uuidv4 } from 'uuid'; // Use UUID for unique order IDs
import Transaction from '../models/Transaction.js';

// @desc    Create a payment order and get transaction token
// @route   POST /api/payment/create-order
export const createPaymentOrder = async (req, res) => {
    // const userId = req.user.id;
    const mockUserId = '60d5f1b2b3b4f8a0b4e9f8a0';

    try {
        const { amount } = req.body;
        const orderId = `ORDER_${uuidv4()}`;

        // Create a transaction record in our database with 'Pending' status
        await Transaction.create({
            userId: mockUserId,
            orderId: orderId,
            amount: amount,
        });

        const paytmParams = {};
        paytmParams.body = {
            "requestType": "Payment",
            "mid": process.env.PAYTM_MERCHANT_ID,
            "websiteName": process.env.PAYTM_WEBSITE,
            "orderId": orderId,
            "callbackUrl": `${process.env.PAYTM_CALLBACK_URL}?orderId=${orderId}`,
            "txnAmount": {
                "value": amount.toFixed(2),
                "currency": "INR",
            },
            "userInfo": {
                "custId": mockUserId,
            },
        };

        // This is a conceptual use of the SDK. The actual implementation may vary.
        const checksum = await Paytm.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY);
        paytmParams.head = { "signature": checksum };

        // Send the necessary details to the frontend to initiate the transaction
        res.json({
            orderId: orderId,
            amount: amount,
            txnToken: checksum, // In a real SDK, a transaction token would be generated here
            merchantId: process.env.PAYTM_MERCHANT_ID
        });

    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ message: 'Failed to create payment order.' });
    }
};

// @desc    Handle the callback from Paytm after payment attempt
// @route   POST /api/payment/callback
export const paymentCallback = async (req, res) => {
    // This is where "Payment verification" happens.
    // The request body from Paytm contains payment details and a signature.
    // We would verify this signature using the Paytm SDK to confirm the transaction is legitimate.
    // If verified, we update our Transaction record status to 'Success' or 'Failed'.
    
    console.log("Paytm Callback Received:", req.body);
    res.send("Callback handled. In production, this would redirect to a success/failure page.");
};