import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;