import Wishlist from '../models/Wishlist.js';

const getWishlistByUser = async (userId) =>
  Wishlist.findOne({ userId }).populate('games');

const addGameToWishlist = async (userId, gameId) => {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, games: [gameId] });
  } else if (!wishlist.games.includes(gameId)) {
    wishlist.games.push(gameId);
  }
  return wishlist.save();
};

const removeGameFromWishlist = async (userId, gameId) => {
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) return null;
  wishlist.games = wishlist.games.filter(id => id.toString() !== gameId);
  return wishlist.save();
};

export default { getWishlistByUser, addGameToWishlist, removeGameFromWishlist };