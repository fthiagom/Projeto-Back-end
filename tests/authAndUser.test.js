const request = require('supertest');
const app = require('../src/app');
const { sequelize, User } = require('../src/models');

describe('Usuários e JWT (/v1/user)', () => {
  const testEmail = `teste_${Date.now()}@email.com`;
  const password = '123@123';
  let token = '';
  let userId = null;

  beforeAll(async () => {
    await sequelize.sync({ alter: true });
  });

  afterAll(async () => {
    if (userId) {
      await User.destroy({ where: { id: userId } });
    }
    await sequelize.close();
  });

  test('POST /v1/user deve cadastrar um usuário e retornar 201', async () => {
    const res = await request(app)
      .post('/v1/user')
      .send({
        firstname: 'Thiago',
        surname: 'Silva',
        email: testEmail,
        password,
        confirmPassword: password
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(testEmail);
    expect(res.body).not.toHaveProperty('password');
    userId = res.body.id;
  });

  test('POST /v1/user/token deve retornar 200 com token JWT', async () => {
    const res = await request(app)
      .post('/v1/user/token')
      .send({
        email: testEmail,
        password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('GET /v1/user/:id deve retornar 200 para usuário existente', async () => {
    const res = await request(app).get(`/v1/user/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.firstname).toBe('Thiago');
  });

  test('GET /v1/user/:id deve retornar 404 para ID inexistente', async () => {
    const res = await request(app).get('/v1/user/999999');
    expect(res.statusCode).toBe(404);
  });

  test('PUT /v1/user/:id sem token deve retornar 400', async () => {
    const res = await request(app)
      .put(`/v1/user/${userId}`)
      .send({
        firstname: 'Thiago Atualizado',
        surname: 'Silva',
        email: testEmail
      });

    expect(res.statusCode).toBe(400);
  });

  test('PUT /v1/user/:id com token deve retornar 204', async () => {
    const res = await request(app)
      .put(`/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstname: 'Thiago Atualizado',
        surname: 'Silva',
        email: testEmail
      });

    expect(res.statusCode).toBe(204);
    expect(res.text).toBe('');
  });

  test('DELETE /v1/user/:id com token deve retornar 204', async () => {
    const res = await request(app)
      .delete(`/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
    userId = null;
  });
});