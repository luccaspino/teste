import rawgController from './rawg.controller.js';
import gameService from '../services/game.service.js';
import { fetchGamesFromRawg } from '../services/rawg.service.js';

jest.mock('../services/game.service.js');
jest.mock('../services/rawg.service.js', () => ({
  fetchGamesFromRawg: jest.fn(),
}));

describe('rawgController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve retornar 201 e o jogo criado', async () => {
      const fakeGame = { id: 1, title: 'Jogo Teste' };
      gameService.createGame.mockResolvedValue(fakeGame);

      await rawgController.create(req, res);

      expect(gameService.createGame).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeGame);
    });

    it('deve retornar 500 em caso de erro', async () => {
      gameService.createGame.mockRejectedValue(new Error('Erro'));

      await rawgController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar jogo.' });
    });
  });

  describe('getAll', () => {
    it('deve retornar 200 e a lista de jogos', async () => {
      const fakeGames = [{ id: 1, title: 'Jogo 1' }];
      gameService.getAllGames.mockResolvedValue(fakeGames);

      await rawgController.getAll(req, res);

      expect(gameService.getAllGames).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeGames);
    });

    it('deve retornar 500 em caso de erro', async () => {
      gameService.getAllGames.mockRejectedValue(new Error('Erro'));

      await rawgController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar jogos.' });
    });
  });

  describe('importFromRawg', () => {
    it('deve importar jogos que não existem e retornar 201', async () => {
      const rawgGames = [
        { id: 1, name: 'RAWG Game 1', released: '2020-01-01', background_image: 'img1', rating: 4, ratings_count: 10 },
        { id: 2, name: 'RAWG Game 2', released: '2021-01-01', background_image: 'img2', rating: 5, ratings_count: 20 }
      ];
      fetchGamesFromRawg.mockResolvedValue(rawgGames);
      gameService.findGameByRawgId
        .mockResolvedValueOnce(null) // Game 1 não existe
        .mockResolvedValueOnce({ id: 2 }); // Game 2 já existe

      const createdGame = { id: 1, title: 'RAWG Game 1' };
      gameService.createGame.mockResolvedValue(createdGame);

      await rawgController.importFromRawg(req, res);

      expect(fetchGamesFromRawg).toHaveBeenCalled();
      expect(gameService.findGameByRawgId).toHaveBeenCalledWith(1);
      expect(gameService.findGameByRawgId).toHaveBeenCalledWith(2);
      expect(gameService.createGame).toHaveBeenCalledWith({
        title: 'RAWG Game 1',
        description: '',
        genre: '',
        releaseDate: '2020-01-01',
        rawgId: 1,
        background_image: 'img1',
        rating: 4,
        ratings_count: 10
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Jogos importados!',
        savedGames: [createdGame]
      });
    });

    it('deve retornar 500 em caso de erro', async () => {
      fetchGamesFromRawg.mockRejectedValue(new Error('Erro'));

      await rawgController.importFromRawg(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao importar jogos da RAWG.' });
    });
  });
});