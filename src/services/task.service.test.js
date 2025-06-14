import Task from '../models/Task.js';
import taskService from './task.service.js';

jest.mock('../models/Task.js');

describe('taskService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma nova tarefa com createTask', async () => {
    const data = { title: 'Nova tarefa' };
    Task.create.mockResolvedValue({ _id: '1', ...data });

    const result = await taskService.createTask(data);

    expect(Task.create).toHaveBeenCalledWith(data);
    expect(result).toEqual({ _id: '1', ...data });
  });

  it('deve retornar tarefas de um usuário com getTasksByUser', async () => {
    const userId = 'user1';
    const tasks = [{ _id: '1', userId }];
    Task.find.mockResolvedValue(tasks);

    const result = await taskService.getTasksByUser(userId);

    expect(Task.find).toHaveBeenCalledWith({ userId });
    expect(result).toEqual(tasks);
  });

  it('deve retornar uma tarefa pelo id e userId com getTaskById', async () => {
    const id = 'task1';
    const userId = 'user2';
    const task = { _id: id, userId };
    Task.findOne.mockResolvedValue(task);

    const result = await taskService.getTaskById(id, userId);

    expect(Task.findOne).toHaveBeenCalledWith({ _id: id, userId });
    expect(result).toEqual(task);
  });

  it('deve atualizar uma tarefa com updateTask', async () => {
    const id = 'task2';
    const userId = 'user3';
    const data = { title: 'Atualizada' };
    const updatedTask = { _id: id, userId, ...data };
    Task.findOneAndUpdate.mockResolvedValue(updatedTask);

    const result = await taskService.updateTask(id, data, userId);

    expect(Task.findOneAndUpdate).toHaveBeenCalledWith({ _id: id, userId }, data, { new: true });
    expect(result).toEqual(updatedTask);
  });

  it('deve deletar uma tarefa com deleteTask', async () => {
    const id = 'task3';
    const userId = 'user4';
    const deletedTask = { _id: id, userId };
    Task.findOneAndDelete.mockResolvedValue(deletedTask);

    const result = await taskService.deleteTask(id, userId);

    expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: id, userId });
    expect(result).toEqual(deletedTask);
  });

  it('deve alternar o status de conclusão da tarefa com toggleTaskCompletion', async () => {
    const id = 'task4';
    const userId = 'user5';
    const task = { _id: id, userId, completed: false, save: jest.fn().mockResolvedValue({ completed: true }) };
    Task.findOne.mockResolvedValue(task);

    const result = await taskService.toggleTaskCompletion(id, userId);

    expect(Task.findOne).toHaveBeenCalledWith({ _id: id, userId });
    expect(task.save).toHaveBeenCalled();
    expect(result).toEqual({ completed: true });
  });

  it('deve retornar null se a tarefa não existir ao alternar conclusão', async () => {
    Task.findOne.mockResolvedValue(null);

    const result = await taskService.toggleTaskCompletion('notfound', 'user6');

    expect(result).toBeNull();
  });
});