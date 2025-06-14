import express from 'express';
import request from 'supertest';
import wishlistController from '../controller/wishlist.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';
import router from './wishlist.route.js';

jest.mock('../controller/wishlist.controller.js');
jest.mock('../middleware/jwt.token.middleware.js');

describe('Wishlist Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/wishlist', router);
  });

  beforeEach(() => {
    verifyToken.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar wishlistController.getWishlist ao fazer GET /wishlist', async () => {
    wishlistController.getWishlist.mockImplementation((req, res) => res.status(200).json([{ id: 'game1' }]));

    const res = await request(app).get('/wishlist');

    expect(verifyToken).toHaveBeenCalled();
    expect(wishlistController.getWishlist).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve chamar wishlistController.addGame ao fazer POST /wishlist/add', async () => {
    wishlistController.addGame.mockImplementation((req, res) => res.status(200).json({ added: true }));

    const res = await request(app)
      .post('/wishlist/add')
      .send({ gameId: 'abc123' });

    expect(wishlistController.addGame).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ added: true });
  });

  it('deve chamar wishlistController.removeGame ao fazer POST /wishlist/remove', async () => {
    wishlistController.removeGame.mockImplementation((req, res) => res.status(200).json({ removed: true }));

    const res = await request(app)
      .post('/wishlist/remove')
      .send({ gameId: 'abc123' });

    expect(wishlistController.removeGame).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ removed: true });
  });

  it('deve bloquear requisição se verifyToken retornar erro', async () => {
    verifyToken.mockImplementationOnce((req, res, next) => res.status(401).json({ message: 'Unauthorized' }));

    const res = await request(app).get('/wishlist');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
    expect(wishlistController.getWishlist).not.toHaveBeenCalled();
  });
});