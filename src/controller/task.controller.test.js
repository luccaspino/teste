import taskController from './task.controller.js';
import taskService from '../services/task.service.js';

jest.mock('../services/task.service.js');

describe('taskController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, userId: 'user1' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma tarefa e retornar 201', async () => {
      const fakeTask = { id: 1, title: 'Nova tarefa' };
      req.body = { title: 'Nova tarefa' };
      taskService.createTask.mockResolvedValue(fakeTask);

      await taskController.create(req, res);

      expect(taskService.createTask).toHaveBeenCalledWith({ title: 'Nova tarefa', userId: 'user1' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeTask);
    });

    it('deve retornar 500 em caso de erro', async () => {
      taskService.createTask.mockRejectedValue(new Error('Erro'));
      await taskController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar tarefa.' });
    });
  });

  describe('getAll', () => {
    it('deve retornar todas as tarefas do usuário', async () => {
      const fakeTasks = [{ id: 1 }, { id: 2 }];
      taskService.getTasksByUser.mockResolvedValue(fakeTasks);

      await taskController.getAll(req, res);

      expect(taskService.getTasksByUser).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeTasks);
    });

    it('deve retornar 500 em caso de erro', async () => {
      taskService.getTasksByUser.mockRejectedValue(new Error('Erro'));
      await taskController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar tarefas.' });
    });
  });

  describe('getById', () => {
    it('deve retornar a tarefa pelo id', async () => {
      req.params.id = '123';
      const fakeTask = { id: '123', title: 'Tarefa' };
      taskService.getTaskById.mockResolvedValue(fakeTask);

      await taskController.getById(req, res);

      expect(taskService.getTaskById).toHaveBeenCalledWith('123', 'user1');
      expect(res.json).toHaveBeenCalledWith(fakeTask);
    });

    it('deve retornar 404 se não encontrar a tarefa', async () => {
      req.params.id = '123';
      taskService.getTaskById.mockResolvedValue(null);

      await taskController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tarefa não encontrada.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.id = '123';
      taskService.getTaskById.mockRejectedValue(new Error('Erro'));

      await taskController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar tarefa.' });
    });
  });

  describe('update', () => {
    it('deve atualizar a tarefa e retornar o objeto atualizado', async () => {
      req.params.id = '123';
      req.body = { title: 'Atualizada' };
      const updatedTask = { id: '123', title: 'Atualizada' };
      taskService.updateTask.mockResolvedValue(updatedTask);

      await taskController.update(req, res);

      expect(taskService.updateTask).toHaveBeenCalledWith('123', { title: 'Atualizada' }, 'user1');
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('deve retornar 404 se não encontrar a tarefa para atualizar', async () => {
      req.params.id = '123';
      req.body = { title: 'Atualizada' };
      taskService.updateTask.mockResolvedValue(null);

      await taskController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tarefa não encontrada.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.id = '123';
      req.body = { title: 'Atualizada' };
      taskService.updateTask.mockRejectedValue(new Error('Erro'));

      await taskController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar tarefa.' });
    });
  });

  describe('remove', () => {
    it('deve remover a tarefa e retornar mensagem de sucesso', async () => {
      req.params.id = '123';
      taskService.deleteTask.mockResolvedValue(true);

      await taskController.remove(req, res);

      expect(taskService.deleteTask).toHaveBeenCalledWith('123', 'user1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Tarefa removida com sucesso.' });
    });

    it('deve retornar 404 se não encontrar a tarefa para remover', async () => {
      req.params.id = '123';
      taskService.deleteTask.mockResolvedValue(false);

      await taskController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tarefa não encontrada.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.id = '123';
      taskService.deleteTask.mockRejectedValue(new Error('Erro'));

      await taskController.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar tarefa.' });
    });
  });

  describe('toggleCompletion', () => {
    it('deve alternar o status da tarefa', async () => {
      req.params.id = '123';
      const updatedTask = { id: '123', completed: true };
      taskService.toggleTaskCompletion.mockResolvedValue(updatedTask);

      await taskController.toggleCompletion(req, res);

      expect(taskService.toggleTaskCompletion).toHaveBeenCalledWith('123', 'user1');
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('deve retornar 404 se não encontrar a tarefa para alternar', async () => {
      req.params.id = '123';
      taskService.toggleTaskCompletion.mockResolvedValue(null);

      await taskController.toggleCompletion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tarefa não encontrada.' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params.id = '123';
      taskService.toggleTaskCompletion.mockRejectedValue(new Error('Erro'));

      await taskController.toggleCompletion(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao alternar status da tarefa.' });
    });
  });
});