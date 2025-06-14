import taskService from '../services/task.service.js';

const create = async (req, res) => {
  try {
    const task = await taskService.createTask({ ...req.body, userId: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar tarefa.' });
  }
};

const getAll = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByUser(req.userId);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tarefas.' });
  }
};

const getById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.userId);
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tarefa.' });
  }
};

const update = async (req, res) => {
  try {
    const updated = await taskService.updateTask(req.params.id, req.body, req.userId);
    if (!updated) return res.status(404).json({ message: 'Tarefa não encontrada.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await taskService.deleteTask(req.params.id, req.userId);
    if (!deleted) return res.status(404).json({ message: 'Tarefa não encontrada.' });
    res.json({ message: 'Tarefa removida com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar tarefa.' });
  }
};

const toggleCompletion = async (req, res) => {
  try {
    const updated = await taskService.toggleTaskCompletion(
      req.params.id, 
      req.userId
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao alternar status da tarefa.' });
  }
};

export default { 
  create, 
  getAll, 
  getById, 
  update, 
  remove,
  toggleCompletion
};
