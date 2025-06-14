import mongoose from 'mongoose';
import Game from './Game.js';

describe('Game Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_games', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Game.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Game.deleteMany({});
  });

  it('deve criar um game válido', async () => {
    const gameData = {
      title: 'The Witcher 3',
      description: 'RPG de ação',
      genre: 'RPG',
      releaseDate: new Date('2015-05-19'),
      rawgId: 3328,
      background_image: 'http://image.url',
      rating: 4.8,
      ratings_count: 10000,
    };
    const game = new Game(gameData);
    const savedGame = await game.save();

    expect(savedGame._id).toBeDefined();
    expect(savedGame.title).toBe(gameData.title);
    expect(savedGame.rawgId).toBe(gameData.rawgId);
  });

  it('deve exigir o campo title', async () => {
    const game = new Game({ rawgId: 123 });
    let err;
    try {
      await game.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  it('não deve permitir rawgId duplicado', async () => {
    const game1 = new Game({ title: 'Game 1', rawgId: 1 });
    const game2 = new Game({ title: 'Game 2', rawgId: 1 });
    await game1.save();
    let err;
    try {
      await game2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error code
  });
});