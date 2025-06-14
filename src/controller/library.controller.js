import libraryService from '../services/library.service.js';
import Game from '../models/Game.js';

const getLibrary = async (req, res) => {
  try {
    const library = await libraryService.getLibraryByUser(req.userId);
    res.status(200).json(library || { games: [] });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar library.' });
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
    const library = await libraryService.addGameToLibrary(req.userId, finalGameId);
    res.status(200).json(library);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar jogo à library.' });
  }
};

const removeGame = async (req, res) => {
  const { gameId } = req.body;
  if (!gameId) return res.status(400).json({ message: 'gameId é obrigatório.' });
  try {
    const library = await libraryService.removeGameFromLibrary(req.userId, gameId);
    res.status(200).json(library);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover jogo da library.' });
  }
};

export default { getLibrary, addGame, removeGame };