import Library from '../models/Library.js';
import libraryService from './library.service.js';

jest.mock('../models/Library.js');

describe('libraryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar a biblioteca de um usuário com getLibraryByUser', async () => {
    const userId = 'user1';
    const library = { userId, games: ['game1'], populate: jest.fn().mockResolvedValue('populatedLibrary') };
    Library.findOne.mockReturnValue(library);

    const result = await libraryService.getLibraryByUser(userId);

    expect(Library.findOne).toHaveBeenCalledWith({ userId });
    expect(library.populate).toHaveBeenCalledWith('games');
    expect(result).toBe('populatedLibrary');
  });

  it('deve adicionar um jogo a uma nova biblioteca com addGameToLibrary', async () => {
    const userId = 'user2';
    const gameId = 'game2';
    Library.findOne.mockResolvedValue(null);
    const saveMock = jest.fn().mockResolvedValue('savedLibrary');
    Library.mockImplementation(() => ({ userId, games: [gameId], save: saveMock }));

    const result = await libraryService.addGameToLibrary(userId, gameId);

    expect(Library.findOne).toHaveBeenCalledWith({ userId });
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe('savedLibrary');
  });

  it('deve adicionar um jogo a uma biblioteca existente se não estiver presente', async () => {
    const userId = 'user3';
    const gameId = 'game3';
    const saveMock = jest.fn().mockResolvedValue('savedLibrary');
    const library = { userId, games: [], save: saveMock };
    Library.findOne.mockResolvedValue(library);

    const result = await libraryService.addGameToLibrary(userId, gameId);

    expect(library.games).toContain(gameId);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe('savedLibrary');
  });

  it('não deve adicionar um jogo já existente na biblioteca', async () => {
    const userId = 'user4';
    const gameId = 'game4';
    const saveMock = jest.fn().mockResolvedValue('savedLibrary');
    const library = { userId, games: [gameId], save: saveMock };
    Library.findOne.mockResolvedValue(library);

    const result = await libraryService.addGameToLibrary(userId, gameId);

    expect(library.games).toEqual([gameId]);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe('savedLibrary');
  });

  it('deve remover um jogo da biblioteca com removeGameFromLibrary', async () => {
    const userId = 'user5';
    const gameId = 'game5';
    const saveMock = jest.fn().mockResolvedValue('savedLibrary');
    const library = { userId, games: [gameId, 'game6'], save: saveMock };
    Library.findOne.mockResolvedValue(library);

    const result = await libraryService.removeGameFromLibrary(userId, gameId);

    expect(library.games).not.toContain(gameId);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe('savedLibrary');
  });

  it('deve retornar null ao tentar remover de uma biblioteca inexistente', async () => {
    Library.findOne.mockResolvedValue(null);

    const result = await libraryService.removeGameFromLibrary('user6', 'game7');

    expect(result).toBeNull();
  });
});