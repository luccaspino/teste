import mongoose from 'mongoose';
import configdb from './configdb.js';

jest.mock('mongoose', () => ({
  set: jest.fn(),
  connect: jest.fn(),
}));

describe('configdb.connect', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, MONGO_URI: 'mongodb://localhost:27017', MONGO_DB_NAME: 'testdb' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('deve conectar ao MongoDB com sucesso', async () => {
    mongoose.connect.mockResolvedValue();
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await configdb.connect();

    expect(mongoose.set).toHaveBeenCalledWith('strictQuery', true);
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017', { dbName: 'testdb' });
    expect(logSpy).toHaveBeenCalledWith('MongoDB connected');
    logSpy.mockRestore();
  });

  it('deve logar erro e chamar process.exit em caso de falha', async () => {
    const error = new Error('Falha de conexão');
    mongoose.connect.mockRejectedValue(error);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await configdb.connect();

    expect(mongoose.set).toHaveBeenCalledWith('strictQuery', true);
    expect(errorSpy).toHaveBeenCalledWith('MongoDB connection error:', error);
    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});