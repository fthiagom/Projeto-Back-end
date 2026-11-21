const userService = require('../services/userService');

async function show(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno ao buscar usuário' });
  }
}

async function store(req, res) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Dados inválidos para cadastro de usuário' });
  }
}

async function update(req, res) {
  try {
    await userService.updateUser(req.params.id, req.body);
    return res.status(204).send();
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Dados inválidos para atualização de usuário' });
  }
}

async function destroy(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Erro ao deletar usuário' });
  }
}

async function token(req, res) {
  try {
    const generatedToken = await userService.generateToken(req.body);
    return res.status(200).json({ token: generatedToken });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Não foi possível gerar o token' });
  }
}

module.exports = {
  show,
  store,
  update,
  destroy,
  token
};