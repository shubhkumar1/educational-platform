import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
    model: {
        type: String,
        enum: ['free', 'monthly', 'one-time'],
        default: 'free'
    },
    price: {
        type: Number,
        default: 0
    }
});

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'creator', 'admin'], default: 'student' },
  profileCompleted: { type: Boolean, default: false },
  pricing: pricingSchema,
  age: { type: Number },
  city: { type: String, trim: true },
  college: { type: String, trim: true },
  department: { type: String, trim: true },
  honoursPaper: { type: String, trim: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;