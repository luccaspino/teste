import mongoose from 'mongoose';
import User from './User.js';

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_users', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('deve criar um usuário válido', async () => {
    const user = new User({
      username: 'joao',
      email: 'joao@email.com',
      password: 'senha123'
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe('joao');
    expect(savedUser.email).toBe('joao@email.com');
  });

  it('deve exigir username', async () => {
    const user = new User({ email: 'a@b.com', password: '123' });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.username).toBeDefined();
  });

  it('deve exigir email', async () => {
    const user = new User({ username: 'joao', password: '123' });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  it('deve exigir password', async () => {
    const user = new User({ username: 'joao', email: 'a@b.com' });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('não deve permitir emails duplicados', async () => {
    await User.create({ username: 'a', email: 'a@b.com', password: '123' });
    let err;
    try {
      await User.create({ username: 'b', email: 'a@b.com', password: '456' });
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error code
  });

  it('não deve retornar o campo password por padrão', async () => {
    await User.create({ username: 'joao', email: 'joao@email.com', password: 'senha123' });
    const user = await User.findOne({ email: 'joao@email.com' });
    expect(user.password).toBeUndefined();
  });

  it('deve retornar o campo password se select("+password") for usado', async () => {
    await User.create({ username: 'joao', email: 'joao@email.com', password: 'senha123' });
    const user = await User.findOne({ email: 'joao@email.com' }).select('+password');
    expect(user.password).toBe('senha123');
  });
});