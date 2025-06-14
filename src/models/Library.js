import mongoose from 'mongoose';

const librarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
});

const Library = mongoose.model('Library', librarySchema);
export default Library;