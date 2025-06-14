import userController from './user.controller.js';
import User from '../models/User.js';
import { registerUser, authenticateUser } from '../services/user.service.js';
import jwt from 'jsonwebtoken';

jest.mock('../models/User.js');
jest.mock('../services/user.service.js');
jest.mock('jsonwebtoken');

describe('userController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getUserByUsername', () => {
    it('deve retornar o usuário se encontrado', async () => {
      req.params.username = 'joao';
      const fakeUser = { username: 'joao', email: 'joao@email.com' };
      User.findOne.mockResolvedValue(fakeUser);

      await userController.getUserByUsername(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'joao' });
      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });

    it('deve retornar 404 se usuário não encontrado', async () => {
      req.params.username = 'naoexiste';
      User.findOne.mockResolvedValue(null);

      await userController.getUserByUsername(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.username = 'erro';
      User.findOne.mockRejectedValue(new Error('Erro'));

      await userController.getUserByUsername(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar usuário' });
    });
  });

  describe('getUserByEmail', () => {
    it('deve retornar o usuário se encontrado pelo email', async () => {
      req.params.email = 'joao@email.com';
      const fakeUser = { username: 'joao', email: 'joao@email.com' };
      User.findOne.mockResolvedValue(fakeUser);

      await userController.getUserByEmail(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'joao@email.com' });
      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });

    it('deve retornar 404 se usuário não encontrado pelo email', async () => {
      req.params.email = 'naoexiste@email.com';
      User.findOne.mockResolvedValue(null);

      await userController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.email = 'erro@email.com';
      User.findOne.mockRejectedValue(new Error('Erro'));

      await userController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar usuário' });
    });
  });

  describe('getUserByIdentifier', () => {
    it('deve buscar por email se identifier for email', async () => {
      req.params.identifier = 'joao@email.com';
      const fakeUser = { username: 'joao', email: 'joao@email.com' };
      User.findOne.mockResolvedValue(fakeUser);

      await userController.getUserByIdentifier(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'joao@email.com' });
      expect(res.json).toHaveBeenCalledWith({ username: 'joao', email: 'joao@email.com' });
    });

    it('deve buscar por username se identifier não for email', async () => {
      req.params.identifier = 'joao';
      const fakeUser = { username: 'joao', email: 'joao@email.com' };
      User.findOne.mockResolvedValue(fakeUser);

      await userController.getUserByIdentifier(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'joao' });
      expect(res.json).toHaveBeenCalledWith({ username: 'joao', email: 'joao@email.com' });
    });

    it('deve retornar 404 se usuário não encontrado', async () => {
      req.params.identifier = 'naoexiste';
      User.findOne.mockResolvedValue(null);

      await userController.getUserByIdentifier(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.identifier = 'erro';
      User.findOne.mockRejectedValue(new Error('Erro'));

      await userController.getUserByIdentifier(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar usuário' });
    });
  });
});