import Rating from '../models/Rating.js';
import Game from '../models/Game.js';
import mongoose from 'mongoose';

export const createRating = async ({ userId, gameId, rating }) => {
  // Validação da existência do jogo
  const game = await Game.findById(gameId);
  if (!game) throw new Error('Jogo não encontrado.');

  // Validação do valor da nota
  if (rating < 0 || rating > 5) {
    throw new Error('A nota deve estar entre 0 e 5.');
  }

  const newRating = new Rating({
    userId,
    gameId,
    rating
  });

  await newRating.save();
  return newRating;
};

export const updateRating = async ({ userId, gameId, rating }) => {
  // Validação do valor da nota
  if (rating < 0 || rating > 5) {
    throw new Error('A nota deve estar entre 0 e 5.');
  }

  const updatedRating = await Rating.findOneAndUpdate(
    { userId, gameId },
    { rating },
    { new: true }
  );

  if (!updatedRating) {
    throw new Error('Avaliação não encontrada.');
  }

  return updatedRating;
};

export const deleteRating = async ({ userId, gameId }) => {
  const deletedRating = await Rating.findOneAndDelete({ userId, gameId });
  
  if (!deletedRating) {
    throw new Error('Avaliação não encontrada.');
  }

  return deletedRating;
};

export const getRatingsByUser = async (userId) => {
  return Rating.find({ userId })
    .populate('gameId', 'title background_image')
    .sort({ createdAt: -1 });
};

export const getRatingsByGame = async (gameId) => {
  return Rating.find({ gameId })
    .populate('userId', 'username')
    .sort({ createdAt: -1 });
};

export const getAverageRatingByGame = async (gameId) => {
  const result = await Rating.aggregate([
    { $match: { gameId: new mongoose.Types.ObjectId(gameId) } },
    {
      $group: {
        _id: null,
        average: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return {
      average: 0,
      count: 0
    };
  }

  return {
    average: parseFloat(result[0].average.toFixed(2)),
    count: result[0].count
  };
};

export const getRatingByUserAndGame = async (userId, gameId) => {
  const rating = await Rating.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    gameId: new mongoose.Types.ObjectId(gameId)
  });

  if (!rating) {
    return null;
  }

  return rating;
}; 