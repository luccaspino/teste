import exampleController from './example.controller.js';

describe('exampleController.securedExample', () => {
  it('deve retornar status 200 e a mensagem correta', async () => {
    // Mocks para req e res
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await exampleController.securedExample(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'This is a secured endpoint' });
  });
});