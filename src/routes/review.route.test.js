import express from 'express';
import request from 'supertest';
import reviewController from '../controller/review.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';
import router from './review.route.js';

jest.mock('../controller/review.controller.js');
jest.mock('../middleware/jwt.token.middleware.js');

describe('Review Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/reviews', router);
  });

  beforeEach(() => {
    // Mock do middleware para passar direto
    verifyToken.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar reviewController.getReviewsForGame ao fazer GET /reviews/game/:gameId', async () => {
    reviewController.getReviewsForGame.mockImplementation((req, res) => res.status(200).json([{ id: '1', rating: 5 }]));

    const res = await request(app).get('/reviews/game/abc123');

    expect(reviewController.getReviewsForGame).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve chamar reviewController.getReviewsForUser ao fazer GET /reviews/user/:userId', async () => {
    reviewController.getReviewsForUser.mockImplementation((req, res) => res.status(200).json([{ id: '1', rating: 4 }]));

    const res = await request(app).get('/reviews/user/user42');

    expect(reviewController.getReviewsForUser).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve chamar verifyToken e reviewController.createReview ao fazer POST /reviews', async () => {
    reviewController.createReview.mockImplementation((req, res) => res.status(201).json({ created: true }));

    const res = await request(app)
      .post('/reviews')
      .send({ gameId: 'abc123', rating: 5, text: 'Ótimo!' });

    expect(verifyToken).toHaveBeenCalled();
    expect(reviewController.createReview).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ created: true });
  });

  it('deve chamar reviewController.importAllReviews ao fazer POST /reviews/import-all', async () => {
    reviewController.importAllReviews.mockImplementation((req, res) => res.status(200).json({ imported: true }));

    const res = await request(app).post('/reviews/import-all');

    expect(reviewController.importAllReviews).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ imported: true });
  });

  it('deve bloquear POST /reviews se verifyToken retornar erro', async () => {
    verifyToken.mockImplementationOnce((req, res, next) => res.status(401).json({ message: 'Unauthorized' }));

    const res = await request(app)
      .post('/reviews')
      .send({ gameId: 'abc123', rating: 5, text: 'Ótimo!' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
    expect(reviewController.createReview).not.toHaveBeenCalled();
  });
});