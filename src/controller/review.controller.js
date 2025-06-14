import { fetchAndSaveReviewsFromRawg, getReviewsByGame, getReviewsByUser } from '../services/review.service.js';
import Game from '../models/Game.js';
import { createLocalReview } from '../services/review.service.js';

const getReviewsForGame = async (req, res) => {
  const { gameId } = req.params;
  try {
    // Busca o Game local
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: 'Game not found.' });

    // Importa e salva reviews da RAWG se necessário
    await fetchAndSaveReviewsFromRawg(game.rawgId);

    // Busca reviews locais
    const reviews = await getReviewsByGame(gameId);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar reviews.', error: err.message });
  }
};

const getReviewsForUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await getReviewsByUser(userId);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar reviews do usuário.', error: err.message });
  }
};

const createReview = async (req, res) => {
  const { gameId, text } = req.body;
  const userId = req.userId; // Supondo que você use autenticação JWT
  const username = req.username || 'Usuário'; // Ajuste conforme seu sistema

  if (!gameId || !text) {
    return res.status(400).json({ message: 'gameId e text são obrigatórios.' });
  }

  try {
    const review = await createLocalReview({ userId, gameId, text, username });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar review.', error: err.message });
  }
};

const importAllReviews = async (req, res) => {
  try {
    const games = await Game.find({ rawgId: { $exists: true } });
    for (const game of games) {
      await fetchAndSaveReviewsFromRawg(game.rawgId);
    }
    res.status(200).json({ message: 'Importação de reviews concluída.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao importar reviews.', error: err.message });
  }
};

export default { getReviewsForGame, getReviewsForUser, createReview, importAllReviews };