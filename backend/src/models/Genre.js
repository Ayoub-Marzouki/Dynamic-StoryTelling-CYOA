import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
  genreId: { type: String, required: true, unique: true }, // e.g., 'scifi'
  label: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
}, { timestamps: true });

export default mongoose.model('Genre', genreSchema);
