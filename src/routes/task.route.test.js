import express from 'express';
import request from 'supertest';
import taskController from '../controller/task.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';
import router from './task.route.js';

jest.mock('../controller/task.controller.js');
jest.mock('../middleware/jwt.token.middleware.js');

describe('Task Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/tasks', router);
  });

  beforeEach(() => {
    verifyToken.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar taskController.create ao fazer POST /tasks', async () => {
    taskController.create.mockImplementation((req, res) => res.status(201).json({ created: true }));

    const res = await request(app).post('/tasks').send({ title: 'Nova tarefa' });

    expect(taskController.create).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ created: true });
  });

  it('deve chamar taskController.getAll ao fazer GET /tasks', async () => {
    taskController.getAll.mockImplementation((req, res) => res.status(200).json([{ id: 1 }]));

    const res = await request(app).get('/tasks');

    expect(taskController.getAll).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve chamar taskController.getById ao fazer GET /tasks/:id', async () => {
    taskController.getById.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

    const res = await request(app).get('/tasks/123');

    expect(taskController.getById).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: '123' });
  });

  it('deve chamar taskController.update ao fazer PUT /tasks/:id', async () => {
    taskController.update.mockImplementation((req, res) => res.status(200).json({ updated: true }));

    const res = await request(app).put('/tasks/123').send({ title: 'Atualizada' });

    expect(taskController.update).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ updated: true });
  });

  it('deve chamar taskController.update ao fazer PATCH /tasks/:id', async () => {
    taskController.update.mockImplementation((req, res) => res.status(200).json({ patched: true }));

    const res = await request(app).patch('/tasks/123').send({ title: 'Patch' });

    expect(taskController.update).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ patched: true });
  });

  it('deve chamar taskController.toggleCompletion ao fazer PATCH /tasks/:id/toggle', async () => {
    taskController.toggleCompletion.mockImplementation((req, res) => res.status(200).json({ toggled: true }));

    const res = await request(app).patch('/tasks/123/toggle');

    expect(taskController.toggleCompletion).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ toggled: true });
  });

  it('deve chamar taskController.remove ao fazer DELETE /tasks/:id', async () => {
    taskController.remove.mockImplementation((req, res) => res.status(200).json({ removed: true }));

    const res = await request(app).delete('/tasks/123');

    expect(taskController.remove).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ removed: true });
  });

  it('deve bloquear requisição se verifyToken retornar erro', async () => {
    verifyToken.mockImplementationOnce((req, res, next) => res.status(401).json({ message: 'Unauthorized' }));

    const res = await request(app).get('/tasks');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
    expect(taskController.getAll).not.toHaveBeenCalled();
  });
});