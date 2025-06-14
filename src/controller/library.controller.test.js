import libraryController from './library.controller.js';
import libraryService from '../services/library.service.js';
import Game from '../models/Game.js';

jest.mock('../services/library.service.js');
jest.mock('../models/Game.js');

describe('libraryController', () => {
  let req, res;

  beforeEach(() => {
    req = { userId: 'user123', body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getLibrary', () => {
    it('deve retornar 200 e a library', async () => {
      const fakeLibrary = { games: [{ id: 1 }] };
      libraryService.getLibraryByUser.mockResolvedValue(fakeLibrary);

      await libraryController.getLibrary(req, res);

      expect(libraryService.getLibraryByUser).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeLibrary);
    });

    it('deve retornar 200 e objeto vazio se não houver library', async () => {
      libraryService.getLibraryByUser.mockResolvedValue(null);

      await libraryController.getLibrary(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ games: [] });
    });

    it('deve retornar 500 em caso de erro', async () => {
      libraryService.getLibraryByUser.mockRejectedValue(new Error('Erro'));

      await libraryController.getLibrary(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar library.' });
    });
  });

  describe('addGame', () => {
    it('deve adicionar jogo usando gameId', async () => {
      req.body = { gameId: 'game123' };
      const fakeLibrary = { games: ['game123'] };
      libraryService.addGameToLibrary.mockResolvedValue(fakeLibrary);

      await libraryController.addGame(req, res);

      expect(libraryService.addGameToLibrary).toHaveBeenCalledWith('user123', 'game123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeLibrary);
    });

    it('deve adicionar jogo usando rawgId', async () => {
      req.body = { rawgId: 'rawg456' };
      const fakeGame = { _id: 'game456' };
      const fakeLibrary = { games: ['game456'] };
      Game.findOne.mockResolvedValue(fakeGame);
      libraryService.addGameToLibrary.mockResolvedValue(fakeLibrary);

      await libraryController.addGame(req, res);

      expect(Game.findOne).toHaveBeenCalledWith({ rawgId: 'rawg456' });
      expect(libraryService.addGameToLibrary).toHaveBeenCalledWith('user123', 'game456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeLibrary);
    });

    it('deve retornar 404 se rawgId não encontrar jogo', async () => {
      req.body = { rawgId: 'rawg789' };
      Game.findOne.mockResolvedValue(null);

      await libraryController.addGame(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Jogo não encontrado.' });
    });

    it('deve retornar 400 se não houver gameId nem rawgId', async () => {
      req.body = {};
      await libraryController.addGame(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'gameId ou rawgId é obrigatório.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.body = { gameId: 'game123' };
      libraryService.addGameToLibrary.mockRejectedValue(new Error('Erro'));

      await libraryController.addGame(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao adicionar jogo à library.' });
    });
  });

  describe('removeGame', () => {
    it('deve remover jogo da library', async () => {
      req.body = { gameId: 'game123' };
      const fakeLibrary = { games: [] };
      libraryService.removeGameFromLibrary.mockResolvedValue(fakeLibrary);

      await libraryController.removeGame(req, res);

      expect(libraryService.removeGameFromLibrary).toHaveBeenCalledWith('user123', 'game123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeLibrary);
    });

    it('deve retornar 400 se não houver gameId', async () => {
      req.body = {};
      await libraryController.removeGame(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'gameId é obrigatório.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.body = { gameId: 'game123' };
      libraryService.removeGameFromLibrary.mockRejectedValue(new Error('Erro'));

      await libraryController.removeGame(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao remover jogo da library.' });
    });
  });
});