const categoryService = require('../services/categoryService');

async function search(req, res) {
  try {
    const result = await categoryService.searchCategories(req.query);
    return res.status(200).json(result);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Erro interno ao buscar categorias' });
  }
}

async function show(req, res) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno ao buscar categoria' });
  }
}

async function store(req, res) {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json(category);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Dados inválidos para cadastro de categoria' });
  }
}

async function update(req, res) {
  try {
    await categoryService.updateCategory(req.params.id, req.body);
    return res.status(204).send();
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Dados inválidos para atualização de categoria' });
  }
}

async function destroy(req, res) {
  try {
    await categoryService.deleteCategory(req.params.id);
    return res.status(204).send();
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Erro ao deletar categoria' });
  }
}

module.exports = {
  search,
  show,
  store,
  update,
  destroy
};