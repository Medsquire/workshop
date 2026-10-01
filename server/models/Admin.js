import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, default: '' }
  },
  {
    collection: 'admin',
    timestamps: true
  }
);

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
