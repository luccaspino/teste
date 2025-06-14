import Task from '../models/Task.js';

const createTask = async (data) => await Task.create(data);
const getTasksByUser = async (userId) => await Task.find({ userId });
const getTaskById = async (id, userId) => await Task.findOne({ _id: id, userId });
const updateTask = async (id, data, userId) => await Task.findOneAndUpdate({ _id: id, userId }, data, { new: true });
const deleteTask = async (id, userId) => await Task.findOneAndDelete({ _id: id, userId });
const toggleTaskCompletion = async (id, userId) => {
  const task = await Task.findOne({ _id: id, userId });
  if (!task) return null;
  
  task.completed = !task.completed;
  return await task.save();
};

export default {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskCompletion
};