import reviewController from './review.controller.js';
import Game from '../models/Game.js';
import { 
  fetchAndSaveReviewsFromRawg, 
  getReviewsByGame, 
  getReviewsByUser, 
  createLocalReview 
} from '../services/review.service.js';

jest.mock('../models/Game.js');
jest.mock('../services/review.service.js', () => ({
  fetchAndSaveReviewsFromRawg: jest.fn(),
  getReviewsByGame: jest.fn(),
  getReviewsByUser: jest.fn(),
  createLocalReview: jest.fn(),
}));

describe('reviewController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, userId: 'user123', username: 'TestUser' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getReviewsForGame', () => {
    it('deve retornar 404 se o jogo não existir', async () => {
      req.params.gameId = 'game1';
      Game.findById.mockResolvedValue(null);

      await reviewController.getReviewsForGame(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game not found.' });
    });

    it('deve retornar 200 e reviews se o jogo existir', async () => {
      req.params.gameId = 'game1';
      const fakeGame = { _id: 'game1', rawgId: 123 };
      const fakeReviews = [{ id: 1, text: 'Ótimo!' }];
      Game.findById.mockResolvedValue(fakeGame);
      fetchAndSaveReviewsFromRawg.mockResolvedValue();
      getReviewsByGame.mockResolvedValue(fakeReviews);

      await reviewController.getReviewsForGame(req, res);

      expect(Game.findById).toHaveBeenCalledWith('game1');
      expect(fetchAndSaveReviewsFromRawg).toHaveBeenCalledWith(123);
      expect(getReviewsByGame).toHaveBeenCalledWith('game1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeReviews);
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.gameId = 'game1';
      Game.findById.mockRejectedValue(new Error('Erro'));

      await reviewController.getReviewsForGame(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Erro ao buscar reviews.' }));
    });
  });

  describe('getReviewsForUser', () => {
    it('deve retornar 200 e reviews do usuário', async () => {
      req.params.userId = 'user123';
      const fakeReviews = [{ id: 1, text: 'Legal' }];
      getReviewsByUser.mockResolvedValue(fakeReviews);

      await reviewController.getReviewsForUser(req, res);

      expect(getReviewsByUser).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeReviews);
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.userId = 'user123';
      getReviewsByUser.mockRejectedValue(new Error('Erro'));

      await reviewController.getReviewsForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Erro ao buscar reviews do usuário.' }));
    });
  });

  describe('createReview', () => {
    it('deve retornar 400 se faltar gameId ou text', async () => {
      req.body = { gameId: '', text: '' };

      await reviewController.createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'gameId e text são obrigatórios.' });
    });

    it('deve criar review e retornar 201', async () => {
      req.body = { gameId: 'game1', text: 'Muito bom!' };
      const fakeReview = { id: 1, text: 'Muito bom!' };
      createLocalReview.mockResolvedValue(fakeReview);

      await reviewController.createReview(req, res);

      expect(createLocalReview).toHaveBeenCalledWith({
        userId: 'user123',
        gameId: 'game1',
        text: 'Muito bom!',
        username: 'TestUser'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeReview);
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.body = { gameId: 'game1', text: 'Muito bom!' };
      createLocalReview.mockRejectedValue(new Error('Erro'));

      await reviewController.createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Erro ao criar review.' }));
    });
  });

  describe('importAllReviews', () => {
    it('deve importar reviews para todos os jogos com rawgId', async () => {
      const games = [{ rawgId: 1 }, { rawgId: 2 }];
      Game.find.mockResolvedValue(games);
      fetchAndSaveReviewsFromRawg.mockResolvedValue();

      await reviewController.importAllReviews(req, res);

      expect(Game.find).toHaveBeenCalledWith({ rawgId: { $exists: true } });
      expect(fetchAndSaveReviewsFromRawg).toHaveBeenCalledWith(1);
      expect(fetchAndSaveReviewsFromRawg).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Importação de reviews concluída.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      Game.find.mockRejectedValue(new Error('Erro'));

      await reviewController.importAllReviews(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Erro ao importar reviews.' }));
    });
  });
});