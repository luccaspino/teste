import express from 'express';
import request from 'supertest';
import libraryController from '../controller/library.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';
import router from './library.route.js';

jest.mock('../controller/library.controller.js');
jest.mock('../middleware/jwt.token.middleware.js');

describe('Library Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/library', router);
  });

  beforeEach(() => {
    // Mock do middleware para passar direto
    verifyToken.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar verifyToken e libraryController.getLibrary ao fazer GET /library', async () => {
    libraryController.getLibrary.mockImplementation((req, res) => res.status(200).json([{ id: 'abc123', title: 'Game' }]));

    const res = await request(app).get('/library');

    expect(verifyToken).toHaveBeenCalled();
    expect(libraryController.getLibrary).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve chamar libraryController.addGame ao fazer POST /library/add', async () => {
    libraryController.addGame.mockImplementation((req, res) => res.status(201).json({ added: true }));

    const res = await request(app)
      .post('/library/add')
      .send({ gameId: 'abc123' });

    expect(libraryController.addGame).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ added: true });
  });

  it('deve chamar libraryController.removeGame ao fazer POST /library/remove', async () => {
    libraryController.removeGame.mockImplementation((req, res) => res.status(200).json({ removed: true }));

    const res = await request(app)
      .post('/library/remove')
      .send({ gameId: 'abc123' });

    expect(libraryController.removeGame).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ removed: true });
  });

  it('deve bloquear requisição se verifyToken retornar erro', async () => {
    verifyToken.mockImplementationOnce((req, res, next) => res.status(401).json({ message: 'Unauthorized' }));

    const res = await request(app).get('/library');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
    expect(libraryController.getLibrary).not.toHaveBeenCalled();
  });
});