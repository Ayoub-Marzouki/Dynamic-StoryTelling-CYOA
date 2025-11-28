import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  genreId: { type: String, required: true }, // e.g. 'scifi', matches Genre.genreId
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalXML: { type: String }, 
  jsonContent: { type: Object, required: true }, 
}, { timestamps: true });

export default mongoose.model('Story', storySchema);
