import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// This is a conceptual function to trigger Paytm's checkout.
// The actual implementation depends on Paytm's specific web/JS integration method.
const triggerPaytmPayment = (paymentDetails) => {
    console.log("Preparing to initiate Paytm payment with:", paymentDetails);
    alert(`
        In a real integration, this would open the Paytm checkout modal.
        Order ID: ${paymentDetails.orderId}
        Amount: ${paymentDetails.amount}
        Merchant ID: ${paymentDetails.merchantId}
    `);
    // The code to open the modal would go here.
};


const SubscriptionPage = () => {
    const handlePayment = async () => {
        try {
            const amount = 280; // Example subscription amount
            
            // Step 1: Call our backend to create a payment order
            const { data } = await axios.post('http://localhost:8080/api/payment/create-order', { amount });

            // Step 2: Use the details from our backend to trigger Paytm's frontend checkout
            triggerPaytmPayment(data);

        } catch (error) {
            console.error('Payment initiation failed:', error);
            alert('Could not initiate payment. Please try again.');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Upgrade Your Subscription</h2>
                <p>Get unlimited access to all content, ad-free.</p>
                <div style={{ border: '1px solid #ccc', padding: '2rem', margin: '2rem auto', maxWidth: '400px' }}>
                    <h3>Monthly Plan</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹280</p>
                    <button onClick={handlePayment} style={{ padding: '0.75rem 1.5rem', background: '#00b9f5', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Pay with Paytm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;