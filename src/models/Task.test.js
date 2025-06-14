import mongoose from 'mongoose';
import Task from './Task.js';

describe('Task Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_tasks', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Task.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Task.deleteMany({});
  });

  it('deve criar uma task válida', async () => {
    const userId = new mongoose.Types.ObjectId();
    const task = new Task({
      userId,
      title: 'Testar API',
      description: 'Testar endpoints da API',
    });

    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.userId.toString()).toBe(userId.toString());
    expect(savedTask.title).toBe('Testar API');
    expect(savedTask.completed).toBe(false);
    expect(savedTask.createdAt).toBeInstanceOf(Date);
  });

  it('deve exigir o campo userId', async () => {
    const task = new Task({ title: 'Sem userId' });
    let err;
    try {
      await task.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
  });

  it('deve exigir o campo title', async () => {
    const task = new Task({ userId: new mongoose.Types.ObjectId() });
    let err;
    try {
      await task.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  it('deve definir completed como false por padrão', async () => {
    const userId = new mongoose.Types.ObjectId();
    const task = new Task({ userId, title: 'Nova tarefa' });
    const savedTask = await task.save();
    expect(savedTask.completed).toBe(false);
  });
});