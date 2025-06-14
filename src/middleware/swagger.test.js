import express from 'express';
import request from 'supertest';
import router from './swagger.js';

describe('Swagger Middleware', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(router);
  });

  it('deve servir a documentação Swagger na rota /docs', async () => {
    const res = await request(app).get('/docs');
    expect(res.status).toBe(301); // Redireciona para /docs/
    expect(res.headers.location).toBe('/docs/');
  });

  it('deve servir a interface Swagger UI em /docs/', async () => {
    const res = await request(app).get('/docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Swagger UI');
  });
});