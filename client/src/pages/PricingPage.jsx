import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { IndianRupee, Repeat, Zap, Gift } from 'lucide-react';

// A reusable component for the pricing model options
const PricingOption = ({ value, title, description, icon, currentModel, setModel }) => {
    const isSelected = currentModel === value;
    const selectedClasses = "border-blue-500 ring-2 ring-blue-500";
    const baseClasses = "border-gray-300";

    return (
        <label
            htmlFor={value}
            className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all focus:outline-none ${isSelected ? selectedClasses : baseClasses}`}
        >
            <input type="radio" id={value} name="pricingModel" value={value} checked={isSelected} onChange={() => setModel(value)} className="sr-only" />
            <div className="flex flex-1">
                <div className="flex flex-col">
                    <span className="block text-sm font-semibold text-gray-900">{title}</span>
                    <span className="mt-1 flex items-center text-sm text-gray-500">{description}</span>
                </div>
            </div>
            <div className="text-blue-600">{icon}</div>
        </label>
    );
};

const PricingPage = () => {
    const navigate = useNavigate();
    const [model, setModel] = useState('monthly');
    const [price, setPrice] = useState(100);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const priceToSave = model === 'free' ? 0 : price;
            await axios.put('http://localhost:8080/api/pricing', {
                model,
                price: priceToSave
            });
            alert('Pricing updated successfully!');
            navigate('/creator/dashboard');
        } catch (error) {
            alert('Failed to update pricing.');
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = "block text-sm font-semibold text-gray-800";
    const inputStyle = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 pl-7";

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-6 sm:p-8">
                    <header className="border-b pb-6 mb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Set Your Content Pricing</h1>
                        <p className="mt-1 text-gray-500">Choose how students will pay for access to your premium content.</p>
                    </header>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={labelStyle}>Pricing Model</label>
                            {/* FIX: Changed to a 3-column grid to accommodate the new option */}
                            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <PricingOption 
                                    value="monthly"
                                    title="Monthly Subscription"
                                    description="Charge a recurring fee."
                                    icon={<Repeat />}
                                    currentModel={model}
                                    setModel={setModel}
                                />
                                <PricingOption 
                                    value="one-time"
                                    title="One-Time Fee"
                                    description="Charge a single payment."
                                    icon={<Zap />}
                                    currentModel={model}
                                    setModel={setModel}
                                />
                                {/* FIX: Added the "Free" option card */}
                                <PricingOption 
                                    value="free"
                                    title="Free"
                                    description="Offer content for free."
                                    icon={<Gift />}
                                    currentModel={model}
                                    setModel={setModel}
                                />
                            </div>
                        </div>

                        {/* This conditional logic will now correctly hide the price input when "Free" is selected */}
                        {model !== 'free' && (
                             <div>
                                <label htmlFor="price" className={labelStyle}>Price</label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">
                                            <IndianRupee size={16} />
                                        </span>
                                    </div>
                                    <input 
                                        type="number" 
                                        id="price" 
                                        value={price} 
                                        onChange={e => setPrice(e.target.value)} 
                                        min="0"
                                        required 
                                        className={inputStyle}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Pricing'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default PricingPage;
