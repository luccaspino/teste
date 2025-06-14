import express from 'express';
import request from 'supertest';
import exampleController from '../controller/example.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';
import router from './example.route.js';

jest.mock('../controller/example.controller.js');
jest.mock('../middleware/jwt.token.middleware.js');

describe('Example Route', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/', router);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar verifyToken e securedExample ao acessar GET /', async () => {
    // Mock do middleware para passar direto
    verifyToken.mockImplementation((req, res, next) => next());
    exampleController.securedExample.mockImplementation((req, res) => res.status(200).json({ ok: true }));

    const res = await request(app).get('/');

    expect(verifyToken).toHaveBeenCalled();
    expect(exampleController.securedExample).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('deve retornar erro se verifyToken bloquear', async () => {
    verifyToken.mockImplementation((req, res, next) => res.status(401).json({ message: 'No token!' }));

    const res = await request(app).get('/');

    expect(verifyToken).toHaveBeenCalled();
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'No token!' });
    expect(exampleController.securedExample).not.toHaveBeenCalled();
  });
});