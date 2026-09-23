import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    college: { type: String, required: true },
    yearOfStudy: { type: String, default: '3rd Year' },
    branch: { type: String, default: 'CSE' },
    joiningType: { type: String, default: 'solo' },
    teamName: { type: String, default: '' },
    missionTrack: { type: String, default: 'AI AGENTS' },
    photoUrl: { type: String, default: null },
    seatNumber: { type: Number, required: true },
    registeredAt: { type: Date, default: Date.now }
  },
  {
    collection: process.env.MONGODB_COLLECTION || 'users',
    timestamps: true
  }
);

export default mongoose.model('User', userSchema);
