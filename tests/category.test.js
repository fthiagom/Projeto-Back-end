const request = require('supertest');
const app = require('../src/app');
const { sequelize, User, Category } = require('../src/models');

describe('Categorias (/v1/category)', () => {
  const email = `cat_admin_${Date.now()}@email.com`;
  const password = '123@123';
  let token = '';
  let userId = null;
  let categoryId = null;

  beforeAll(async () => {
    await sequelize.sync({ alter: true });

    const userRes = await request(app)
      .post('/v1/user')
      .send({
        firstname: 'Admin',
        surname: 'Cat',
        email,
        password,
        confirmPassword: password
      });
    userId = userRes.body.id;

    const tokenRes = await request(app)
      .post('/v1/user/token')
      .send({ email, password });
    token = tokenRes.body.token;
  });

  afterAll(async () => {
    if (categoryId) {
      await Category.destroy({ where: { id: categoryId } });
    }
    if (userId) {
      await User.destroy({ where: { id: userId } });
    }
    await sequelize.close();
  });

  test('POST /v1/category deve criar categoria e retornar 201', async () => {
    const res = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Calçados',
        slug: 'calcados',
        use_in_menu: true
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Calçados');
    categoryId = res.body.id;
  });

  test('GET /v1/category/search deve retornar estrutura paginada com 200', async () => {
    const res = await request(app).get('/v1/category/search?limit=12&page=1');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('limit', 12);
    expect(res.body).toHaveProperty('page', 1);
  });

  test('GET /v1/category/:id deve retornar 200 para categoria existente', async () => {
    const res = await request(app).get(`/v1/category/${categoryId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(categoryId);
  });

  test('PUT /v1/category/:id deve atualizar e retornar 204', async () => {
    const res = await request(app)
      .put(`/v1/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Calçados Esportivos',
        slug: 'calcados-esportivos',
        use_in_menu: false
      });

    expect(res.statusCode).toBe(204);
  });

  test('DELETE /v1/category/:id deve remover e retornar 204', async () => {
    const res = await request(app)
      .delete(`/v1/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
    categoryId = null;
  });
});