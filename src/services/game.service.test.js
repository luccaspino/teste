import Game from '../models/Game.js';
import gameService from './game.service.js';

jest.mock('../models/Game.js');

describe('gameService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um novo jogo com createGame', async () => {
    const data = { title: 'The Witcher 3' };
    Game.create.mockResolvedValue({ _id: '1', ...data });

    const result = await gameService.createGame(data);

    expect(Game.create).toHaveBeenCalledWith(data);
    expect(result).toEqual({ _id: '1', ...data });
  });

  it('deve retornar todos os jogos com getAllGames', async () => {
    const games = [{ _id: '1', title: 'Game 1' }];
    Game.find.mockResolvedValue(games);

    const result = await gameService.getAllGames();

    expect(Game.find).toHaveBeenCalled();
    expect(result).toEqual(games);
  });

  it('deve buscar um jogo pelo rawgId com findGameByRawgId', async () => {
    const game = { _id: '2', rawgId: 'abc123' };
    Game.findOne.mockResolvedValue(game);

    const result = await gameService.findGameByRawgId('abc123');

    expect(Game.findOne).toHaveBeenCalledWith({ rawgId: 'abc123' });
    expect(result).toEqual(game);
  });
});