import mongoose from 'mongoose';
import Review from './Review.js';

describe('Review Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_reviews', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Review.syncIndexes(); // <-- Add this line
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Review.deleteMany({});
  });

  it('deve criar uma review válida', async () => {
    const gameId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const review = new Review({
      user: userId,
      game: gameId,
      username: 'testuser',
      text: 'Ótimo jogo!',
      rawgReviewId: 'rawg-123',
      rawgGameId: 456,
    });

    const savedReview = await review.save();

    expect(savedReview._id).toBeDefined();
    expect(savedReview.game.toString()).toBe(gameId.toString());
    expect(savedReview.user.toString()).toBe(userId.toString());
    expect(savedReview.username).toBe('testuser');
    expect(savedReview.text).toBe('Ótimo jogo!');
    expect(savedReview.rawgReviewId).toBe('rawg-123');
    expect(savedReview.rawgGameId).toBe(456);
    expect(savedReview.created_at).toBeInstanceOf(Date);
  });

  it('deve exigir o campo game', async () => {
    const review = new Review({ username: 'user' });
    let err;
    try {
      await review.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.game).toBeDefined();
  });

  it('não deve permitir rawgReviewId duplicado', async () => {
    const gameId = new mongoose.Types.ObjectId();
    await Review.create({ game: gameId, rawgReviewId: 'rawg-dup' });

    let err;
    try {
      await Review.create({ game: gameId, rawgReviewId: 'rawg-dup' });
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error code
  });

  it('deve permitir múltiplas reviews sem rawgReviewId', async () => {
    const gameId = new mongoose.Types.ObjectId();
    await Review.create({ game: gameId, text: 'Primeira review' });
    await Review.create({ game: gameId, text: 'Segunda review' });

    const reviews = await Review.find({ game: gameId });
    expect(reviews.length).toBe(2);
  });
});