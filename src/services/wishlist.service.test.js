import Wishlist from '../models/Wishlist.js';
import wishlistService from './wishlist.service.js';

jest.mock('../models/Wishlist.js');

describe('wishlistService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar a wishlist de um usuário com getWishlistByUser', async () => {
    const userId = 'user1';
    const wishlist = { userId, games: ['game1'], populate: jest.fn().mockResolvedValue('populatedWishlist') };
    Wishlist.findOne.mockReturnValue(wishlist);

    const result = await wishlistService.getWishlistByUser(userId);

    expect(Wishlist.findOne).toHaveBeenCalledWith({ userId });
    expect(wishlist.populate).toHaveBeenCalledWith('games');
    expect(result).toBe('populatedWishlist');
  });

  it('deve adicionar um jogo a uma nova wishlist com addGameToWishlist', async () => {
    const userId = 'user2';
    const gameId = 'game2';
    Wishlist.findOne.mockResolvedValue(null);
    const saveMock = jest.fn().mockResolvedValue('savedWishlist');
    Wishlist.mockImplementation(() => ({ userId, games: [gameId], save: saveMock }));

    const result = await wishlistService.addGameToWishlist(userId, gameId);

    expect(Wishlist.findOne).toHaveBeenCalledWith({ userId });
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe('savedWishlist');
  });

  it('deve adicionar um jogo a uma wishlist existente se não estiver presente', async () => {
    const userId = 'user3';
    const gameId = 'game3';
    const saveMock = jest.fn().mockResolvedValue('savedWishlist');
    const wishlist = { userId, games: [], save: saveMock };
    Wishlist.findOne.mockResolvedValue(wishlist);

    const result = await wishlistService.addGameToWishlist(userId, gameId);

    expect(wishlist.games).toContain(gameId);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe('savedWishlist');
  });

  it('não deve adicionar um jogo já existente na wishlist', async () => {
    const userId = 'user4';
    const gameId = 'game4';
    const saveMock = jest.fn().mockResolvedValue('savedWishlist');
    const wishlist = { userId, games: [gameId], save: saveMock };
    Wishlist.findOne.mockResolvedValue(wishlist);

    const result = await wishlistService.addGameToWishlist(userId, gameId);

    expect(wishlist.games).toEqual([gameId]);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe('savedWishlist');
  });

  it('deve remover um jogo da wishlist com removeGameFromWishlist', async () => {
    const userId = 'user5';
    const gameId = 'game5';
    const saveMock = jest.fn().mockResolvedValue('savedWishlist');
    const wishlist = { userId, games: [gameId, 'game6'], save: saveMock };
    Wishlist.findOne.mockResolvedValue(wishlist);

    const result = await wishlistService.removeGameFromWishlist(userId, gameId);

    expect(wishlist.games).not.toContain(gameId);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe('savedWishlist');
  });

  it('deve retornar null ao tentar remover de uma wishlist inexistente', async () => {
    Wishlist.findOne.mockResolvedValue(null);

    const result = await wishlistService.removeGameFromWishlist('user6', 'game7');

    expect(result).toBeNull();
  });
});