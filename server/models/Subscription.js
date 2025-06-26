import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'inactive', 'free_tier'], default: 'free_tier' },
  monthlyUsageMinutes: { type: Number, default: 0 }, // Tracks usage for non-subscribers 
  expiresAt: { type: Date },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;