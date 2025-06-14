import wishlistService from '../services/wishlist.service.js';

import Game from '../models/Game.js';

const getWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistService.getWishlistByUser(req.userId);
    res.status(200).json(wishlist || { games: [] });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar wishlist.' });
  }
};

const addGame = async (req, res) => {
  const { gameId, rawgId } = req.body;
  let finalGameId = gameId;
  if (!finalGameId && rawgId) {
    const game = await Game.findOne({ rawgId });
    if (!game) return res.status(404).json({ message: 'Jogo não encontrado.' });
    finalGameId = game._id;
  }
  if (!finalGameId) return res.status(400).json({ message: 'gameId ou rawgId é obrigatório.' });
  try {
    const wishlist = await wishlistService.addGameToWishlist(req.userId, finalGameId);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar jogo à wishlist.' });
  }
};

const removeGame = async (req, res) => {
  const { gameId } = req.body;
  if (!gameId) return res.status(400).json({ message: 'gameId é obrigatório.' });
  try {
    const wishlist = await wishlistService.removeGameFromWishlist(req.userId, gameId);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover jogo da wishlist.' });
  }
};

export default { getWishlist, addGame, removeGame };