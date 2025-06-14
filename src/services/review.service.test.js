import * as reviewService from './review.service.js';
import fetch from 'node-fetch';
import Review from '../models/Review.js';
import Game from '../models/Game.js';

jest.mock('node-fetch', () => jest.fn());
jest.mock('../models/Review.js');
jest.mock('../models/Game.js');

describe('review.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAndSaveReviewsFromRawg', () => {
    it('deve buscar reviews do RAWG, salvar e retornar reviews locais', async () => {
      const rawgGameId = '123';
      const mockReviews = [
        { id: 'r1', text: 'Ótimo!', user: { username: 'user1' }, created_at: '2024-01-01T00:00:00Z' },
        { id: 'r2', text: 'Legal!', user: null, created_at: null }
      ];
      const mockJson = jest.fn().mockResolvedValue({ results: mockReviews });
      fetch.mockResolvedValue({ ok: true, json: mockJson });

      const game = { _id: 'localGameId' };
      Game.findOne.mockResolvedValue(game);

      Review.updateOne.mockResolvedValue({});
      Review.find.mockResolvedValue(['review1', 'review2']);

      const result = await reviewService.fetchAndSaveReviewsFromRawg(rawgGameId);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(rawgGameId));
      expect(Game.findOne).toHaveBeenCalledWith({ rawgId: rawgGameId });
      expect(Review.updateOne).toHaveBeenCalledTimes(2);
      expect(Review.find).toHaveBeenCalledWith({ game: game._id });
      expect(result).toEqual(['review1', 'review2']);
    });

    it('deve lançar erro se a resposta do RAWG não for ok', async () => {
      fetch.mockResolvedValue({ ok: false });
      await expect(reviewService.fetchAndSaveReviewsFromRawg('fail')).rejects.toThrow('Failed to fetch reviews from RAWG');
    });

    it('deve lançar erro se o jogo não existir no banco local', async () => {
      fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue({ results: [] }) });
      Game.findOne.mockResolvedValue(null);
      await expect(reviewService.fetchAndSaveReviewsFromRawg('notfound')).rejects.toThrow('Game not found in local database');
    });
  });

  describe('getReviewsByGame', () => {
    it('deve retornar reviews pelo gameId', async () => {
      Review.find.mockResolvedValue(['reviewA']);
      const result = await reviewService.getReviewsByGame('gameId');
      expect(Review.find).toHaveBeenCalledWith({ game: 'gameId' });
      expect(result).toEqual(['reviewA']);
    });
  });

  describe('getReviewsByUser', () => {
    it('deve retornar reviews pelo userId', async () => {
      Review.find.mockResolvedValue(['reviewB']);
      const result = await reviewService.getReviewsByUser('userId');
      expect(Review.find).toHaveBeenCalledWith({ user: 'userId' });
      expect(result).toEqual(['reviewB']);
    });
  });

  describe('createLocalReview', () => {
    it('deve criar e salvar uma review local', async () => {
      const mockReview = { save: jest.fn().mockResolvedValue(), _id: 'r1' };
      Game.findById.mockResolvedValue({ _id: 'gameId' });
      Review.mockImplementation(() => mockReview);

      const data = { userId: 'u1', gameId: 'gameId', text: 'Texto', username: 'userX' };
      const result = await reviewService.createLocalReview(data);

      expect(Game.findById).toHaveBeenCalledWith('gameId');
      expect(mockReview.save).toHaveBeenCalled();
      expect(result).toBe(mockReview);
    });

    it('deve lançar erro se o jogo não existir', async () => {
      Game.findById.mockResolvedValue(null);
      await expect(reviewService.createLocalReview({ userId: 'u2', gameId: 'notfound', text: 't', username: 'u' }))
        .rejects.toThrow('Game not found.');
    });
  });
});