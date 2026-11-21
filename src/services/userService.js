const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const USER_PUBLIC_ATTRIBUTES = ['id', 'firstname', 'surname', 'email'];

async function getUserById(id) {
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return User.findByPk(userId, {
    attributes: USER_PUBLIC_ATTRIBUTES
  });
}

async function createUser(body = {}) {
  const { firstname, surname, email, password, confirmPassword } = body;

  if (!firstname || !surname || !email || !password || !confirmPassword) {
    const error = new Error('Todos os campos obrigatórios devem ser preenchidos');
    error.statusCode = 400;
    throw error;
  }

  if (password !== confirmPassword) {
    const error = new Error('A senha e a confirmação de senha não conferem');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Já existe um usuário cadastrado com este e-mail');
    error.statusCode = 400;
    throw error;
  }

  const created = await User.create({
    firstname,
    surname,
    email,
    password
  });

  return {
    id: created.id,
    firstname: created.firstname,
    surname: created.surname,
    email: created.email
  };
}

async function updateUser(id, body = {}) {
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    const error = new Error('ID de usuário inválido');
    error.statusCode = 400;
    throw error;
  }

  const { firstname, surname, email } = body;

  if (!firstname || !surname || !email) {
    const error = new Error('firstname, surname e email são obrigatórios');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  const emailOwner = await User.findOne({ where: { email } });
  if (emailOwner && emailOwner.id !== user.id) {
    const error = new Error('E-mail já está em uso por outro usuário');
    error.statusCode = 400;
    throw error;
  }

  await user.update({
    firstname,
    surname,
    email
  });
}

async function deleteUser(id) {
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    const error = new Error('ID de usuário inválido');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  await user.destroy();
}

async function generateToken(body = {}) {
  const { email, password } = body;

  if (!email || !password) {
    const error = new Error('E-mail e senha são obrigatórios');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 400;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return token;
}

module.exports = {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  generateToken
};