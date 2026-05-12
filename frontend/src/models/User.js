import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  wallet_address: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['creator', 'freelancer', 'both'],
    default: 'both',
  },
  reputation_score: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
