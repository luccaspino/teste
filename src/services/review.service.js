import fetch from 'node-fetch';
import Review from '../models/Review.js';
import Game from '../models/Game.js';

const API_KEY = 'ac25b624a98d4348bc5c4a45abb34eed';

export const fetchAndSaveReviewsFromRawg = async (rawgGameId) => {
  const url = `https://api.rawg.io/api/games/${rawgGameId}/reviews?key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch reviews from RAWG');
  const data = await response.json();

  // Busca o Game local pelo rawgId
  const game = await Game.findOne({ rawgId: rawgGameId });
  if (!game) throw new Error('Game not found in local database');

  // Salva reviews no banco, evitando duplicatas
  for (const review of data.results) {
    await Review.updateOne(
      { rawgReviewId: review.id },
      {
        $setOnInsert: {
          rawgReviewId: review.id,
          rawgGameId,
          game: game._id,
          username: review.user?.username || 'Anonymous',
          text: review.text,
          created_at: review.created_at ? new Date(review.created_at) : new Date()
        }
      },
      { upsert: true }
    );
  }

  // Retorna todas as reviews desse jogo
  return Review.find({ game: game._id });
};

export const getReviewsByGame = async (gameId) => {
  return Review.find({ game: gameId });
};

export const getReviewsByUser = async (userId) => {
  return Review.find({ user: userId });
};

export const createLocalReview = async ({ userId, gameId, text, username }) => {
  const game = await Game.findById(gameId);
  if (!game) throw new Error('Game not found.');

  const review = new Review({
    user: userId,
    game: gameId,
    username,
    text,
    created_at: new Date()
  });

  await review.save();
  return review;
};