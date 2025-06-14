import jwt from 'jsonwebtoken';
import verifyToken from './jwt.token.middleware.js';

jest.mock('jsonwebtoken');

describe('verifyToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('deve retornar 401 se não houver token', () => {
    req.headers = {};
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 se o token for inválido', () => {
    req.headers = { authorization: 'Bearer invalidtoken' };
    jwt.verify.mockImplementation((token, secret, cb) => cb(new Error('invalid'), null));

    verifyToken(req, res, next);

    // jwt.verify é async, mas o middleware usa callback, então já é chamado
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to authenticate token!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve definir req.userId e chamar next se o token for válido', () => {
    req.headers = { authorization: 'Bearer validtoken' };
    jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 'user123' }));

    verifyToken(req, res, next);

    expect(req.userId).toBe('user123');
    expect(next).toHaveBeenCalled();
  });

  it('deve retornar 500 em caso de erro inesperado', () => {
    req.headers = { authorization: 'Bearer validtoken' };
    // Força um erro no split
    Object.defineProperty(req.headers, 'authorization', {
      get: () => { throw new Error('Unexpected'); }
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error!' });
    expect(next).not.toHaveBeenCalled();
  });
});