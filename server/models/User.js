import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'creator', 'admin'], default: 'student' },
  profileCompleted: { type: Boolean, default: false }, // Flag for first-time onboarding flow 
  // Additional profile fields from the role-based form will be added here
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;