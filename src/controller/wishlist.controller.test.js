import wishlistController from './wishlist.controller.js';
import wishlistService from '../services/wishlist.service.js';
import Game from '../models/Game.js';

jest.mock('../services/wishlist.service.js');
jest.mock('../models/Game.js');

describe('wishlistController', () => {
  let req, res;

  beforeEach(() => {
    req = { userId: 'user1', body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getWishlist', () => {
    it('deve retornar a wishlist do usuário', async () => {
      const fakeWishlist = { games: ['game1', 'game2'] };
      wishlistService.getWishlistByUser.mockResolvedValue(fakeWishlist);

      await wishlistController.getWishlist(req, res);

      expect(wishlistService.getWishlistByUser).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeWishlist);
    });

    it('deve retornar uma lista vazia se não houver wishlist', async () => {
      wishlistService.getWishlistByUser.mockResolvedValue(null);

      await wishlistController.getWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ games: [] });
    });

    it('deve retornar 500 em caso de erro', async () => {
      wishlistService.getWishlistByUser.mockRejectedValue(new Error('Erro'));

      await wishlistController.getWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar wishlist.' });
    });
  });

  describe('addGame', () => {
    it('deve adicionar um jogo usando gameId', async () => {
      req.body = { gameId: 'game1' };
      const fakeWishlist = { games: ['game1'] };
      wishlistService.addGameToWishlist.mockResolvedValue(fakeWishlist);

      await wishlistController.addGame(req, res);

      expect(wishlistService.addGameToWishlist).toHaveBeenCalledWith('user1', 'game1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeWishlist);
    });

    it('deve adicionar um jogo usando rawgId', async () => {
      req.body = { rawgId: 123 };
      const fakeGame = { _id: 'game2' };
      const fakeWishlist = { games: ['game2'] };
      Game.findOne.mockResolvedValue(fakeGame);
      wishlistService.addGameToWishlist.mockResolvedValue(fakeWishlist);

      await wishlistController.addGame(req, res);

      expect(Game.findOne).toHaveBeenCalledWith({ rawgId: 123 });
      expect(wishlistService.addGameToWishlist).toHaveBeenCalledWith('user1', 'game2');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeWishlist);
    });

    it('deve retornar 404 se rawgId não encontrar jogo', async () => {
      req.body = { rawgId: 999 };
      Game.findOne.mockResolvedValue(null);

      await wishlistController.addGame(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Jogo não encontrado.' });
    });

    it('deve retornar 400 se não houver gameId nem rawgId', async () => {
      req.body = {};
      await wishlistController.addGame(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'gameId ou rawgId é obrigatório.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.body = { gameId: 'game1' };
      wishlistService.addGameToWishlist.mockRejectedValue(new Error('Erro'));

      await wishlistController.addGame(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao adicionar jogo à wishlist.' });
    });
  });

  describe('removeGame', () => {
    it('deve remover um jogo da wishlist', async () => {
      req.body = { gameId: 'game1' };
      const fakeWishlist = { games: [] };
      wishlistService.removeGameFromWishlist.mockResolvedValue(fakeWishlist);

      await wishlistController.removeGame(req, res);

      expect(wishlistService.removeGameFromWishlist).toHaveBeenCalledWith('user1', 'game1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeWishlist);
    });

    it('deve retornar 400 se não houver gameId', async () => {
      req.body = {};
      await wishlistController.removeGame(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'gameId é obrigatório.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.body = { gameId: 'game1' };
      wishlistService.removeGameFromWishlist.mockRejectedValue(new Error('Erro'));

      await wishlistController.removeGame(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao remover jogo da wishlist.' });
    });
  });
});