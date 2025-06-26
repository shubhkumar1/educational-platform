import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'creator', 'admin'], default: 'student' },
  profileCompleted: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;