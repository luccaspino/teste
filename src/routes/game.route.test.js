import express from 'express';
import request from 'supertest';
import gameController from '../controller/game.controller.js';
import rawgController from '../controller/rawg.controller.js';
import router from './game.route.js';

jest.mock('../controller/game.controller.js');
jest.mock('../controller/rawg.controller.js');

describe('Game Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/games', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar gameController.create ao fazer POST /games', async () => {
    gameController.create.mockImplementation((req, res) => res.status(201).json({ id: 1, ...req.body }));

    const res = await request(app)
      .post('/games')
      .send({ title: 'The Witcher 3', genre: 'RPG' });

    expect(gameController.create).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'The Witcher 3', genre: 'RPG' });
  });

  it('deve chamar gameController.getAll ao fazer GET /games', async () => {
    gameController.getAll.mockImplementation((req, res) => res.status(200).json([{ id: 1, title: 'Game' }]));

    const res = await request(app).get('/games');

    expect(gameController.getAll).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve chamar rawgController.importFromRawg ao fazer POST /games/import-rawg', async () => {
    rawgController.importFromRawg.mockImplementation((req, res) => res.status(200).json({ imported: true }));

    const res = await request(app).post('/games/import-rawg');

    expect(rawgController.importFromRawg).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ imported: true });
  });
});