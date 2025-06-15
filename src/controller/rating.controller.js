import {
  createRating,
  updateRating,
  deleteRating,
  getRatingsByUser,
  getRatingsByGame,
  getAverageRatingByGame,
  getRatingByUserAndGame
} from '../services/rating.service.js';

export const createRatingController = async (req, res) => {
  try {
    const { gameId, rating } = req.body;
    const userId = req.userId; // Vem do middleware de autenticação

    const newRating = await createRating({ userId, gameId, rating });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar avaliação', error: error.message });
  }
};

export const updateRatingController = async (req, res) => {
  try {
    const { gameId, rating } = req.body;
    const userId = req.userId; // Vem do middleware de autenticação

    const updatedRating = await updateRating({ userId, gameId, rating });
    res.json(updatedRating);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar avaliação', error: error.message });
  }
};

export const deleteRatingController = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.userId; // Vem do middleware de autenticação

    const deletedRating = await deleteRating({ userId, gameId });
    res.json(deletedRating);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar avaliação', error: error.message });
  }
};

export const getRatingsByUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await getRatingsByUser(userId);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliações do usuário', error: error.message });
  }
};

export const getRatingsByGameController = async (req, res) => {
  try {
    const { gameId } = req.params;
    const ratings = await getRatingsByGame(gameId);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliações do jogo', error: error.message });
  }
};

export const getAverageRatingByGameController = async (req, res) => {
  try {
    const { gameId } = req.params;
    const averageRating = await getAverageRatingByGame(gameId);
    res.json(averageRating);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar média de avaliações', error: error.message });
  }
};

export const getRatingByUserAndGameController = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.userId; // Vem do middleware de autenticação

    const rating = await getRatingByUserAndGame(userId, gameId);
    
    if (!rating) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }

    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliação', error: error.message });
  }
};

export default {
  createRating: createRatingController,
  updateRating: updateRatingController,
  deleteRating: deleteRatingController,
  getRatingsByUser: getRatingsByUserController,
  getRatingsByGame: getRatingsByGameController,
  getAverageRatingByGame: getAverageRatingByGameController,
  getRatingByUserAndGame: getRatingByUserAndGameController
}; 