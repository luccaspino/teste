import mongoose from 'mongoose';
import Wishlist from './Wishlist.js';

describe('Wishlist Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_wishlist', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Wishlist.syncIndexes(); // <-- Add this line
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Wishlist.deleteMany({});
  });

  it('deve criar uma wishlist válida', async () => {
    const userId = new mongoose.Types.ObjectId();
    const gameId1 = new mongoose.Types.ObjectId();
    const gameId2 = new mongoose.Types.ObjectId();

    const wishlist = new Wishlist({
      userId,
      games: [gameId1, gameId2],
    });

    const savedWishlist = await wishlist.save();

    expect(savedWishlist._id).toBeDefined();
    expect(savedWishlist.userId.toString()).toBe(userId.toString());
    expect(savedWishlist.games.length).toBe(2);
    expect(savedWishlist.games[0].toString()).toBe(gameId1.toString());
  });

  it('deve exigir o campo userId', async () => {
    const wishlist = new Wishlist({ games: [] });
    let err;
    try {
      await wishlist.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
  });

  it('não deve permitir userId duplicado', async () => {
    const userId = new mongoose.Types.ObjectId();
    await Wishlist.create({ userId, games: [] });

    let err;
    try {
      await Wishlist.create({ userId, games: [] });
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error code
  });
});