import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
export default Session;