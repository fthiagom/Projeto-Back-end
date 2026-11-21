const request = require('supertest');
const app = require('../src/app');
const { sequelize, User, Category, Product } = require('../src/models');

describe('Produtos (/v1/product)', () => {
  const email = `prod_admin_${Date.now()}@email.com`;
  const password = '123@123';
  let token = '';
  let userId = null;
  let categoryId = null;
  let productId = null;

  beforeAll(async () => {
    await sequelize.sync({ alter: true });

    const userRes = await request(app)
      .post('/v1/user')
      .send({
        firstname: 'Admin',
        surname: 'Prod',
        email,
        password,
        confirmPassword: password
      });
    userId = userRes.body.id;

    const tokenRes = await request(app)
      .post('/v1/user/token')
      .send({ email, password });
    token = tokenRes.body.token;

    const catRes = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Tênis',
        slug: 'tenis',
        use_in_menu: true
      });
    categoryId = catRes.body.id;
  });

  afterAll(async () => {
    if (productId) {
      await Product.destroy({ where: { id: productId } });
    }
    if (categoryId) {
      await Category.destroy({ where: { id: categoryId } });
    }
    if (userId) {
      await User.destroy({ where: { id: userId } });
    }
    await sequelize.close();
  });

  test('POST /v1/product deve criar produto e retornar 201', async () => {
    const res = await request(app)
      .post('/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        enabled: true,
        name: 'Produto 01',
        slug: 'produto-01',
        stock: 10,
        description: 'Descrição do produto 01',
        price: 119.9,
        price_with_discount: 99.9,
        category_ids: [categoryId],
        images: [
          {
            type: 'image/png',
            content: 'https://store.com/media/product-01/image-01.png'
          }
        ],
        options: [
          {
            title: 'Tamanho',
            shape: 'square',
            radius: 4,
            type: 'text',
            values: ['M', 'G']
          }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Produto 01');
    productId = res.body.id;
  });

  test('GET /v1/product/search deve retornar 200', async () => {
    const res = await request(app).get('/v1/product/search?match=Produto');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('total');
  });

  test('GET /v1/product/:id deve retornar 200', async () => {
    const res = await request(app).get(`/v1/product/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(productId);
  });

  test('PUT /v1/product/:id deve atualizar e retornar 204', async () => {
    const res = await request(app)
      .put(`/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto 01 Atualizado',
        stock: 25
      });

    expect(res.statusCode).toBe(204);
  });

  test('DELETE /v1/product/:id deve remover e retornar 204', async () => {
    const res = await request(app)
      .delete(`/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
    productId = null;
  });
});