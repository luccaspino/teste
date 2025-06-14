import express from 'express';
import request from 'supertest';
import userController from '../controller/user.controller.js';
import router from './user.route.js';

jest.mock('../controller/user.controller.js');

describe('User Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/users', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar userController.register ao fazer POST /users/register', async () => {
    userController.register.mockImplementation((req, res) => res.status(201).json({ registered: true }));

    const res = await request(app)
      .post('/users/register')
      .send({ username: 'joao', email: 'joao@email.com', password: '123456' });

    expect(userController.register).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ registered: true });
  });

  it('deve chamar userController.login ao fazer POST /users/login', async () => {
    userController.login.mockImplementation((req, res) => res.status(200).json({ token: 'jwt-token' }));

    const res = await request(app)
      .post('/users/login')
      .send({ username: 'joao', email: 'joao@email.com', password: '123456' });

    expect(userController.login).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: 'jwt-token' });
  });

  it('deve chamar userController.getUserByIdentifier ao fazer GET /users/:identifier', async () => {
    userController.getUserByIdentifier.mockImplementation((req, res) => res.status(200).json({ username: req.params.identifier }));

    const res = await request(app).get('/users/joao');

    expect(userController.getUserByIdentifier).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ username: 'joao' });
  });
});