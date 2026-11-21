const productService = require('../services/productService');

async function search(req, res) {
  try {
    const result = await productService.searchProducts(req.query);
    return res.status(200).json(result);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Erro interno ao buscar produtos' });
  }
}

async function show(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno ao buscar produto' });
  }
}

async function store(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Dados inválidos para cadastro de produto' });
  }
}

async function update(req, res) {
  try {
    await productService.updateProduct(req.params.id, req.body);
    return res.status(204).send();
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Dados inválidos para atualização de produto' });
  }
}

async function destroy(req, res) {
  try {
    await productService.deleteProduct(req.params.id);
    return res.status(204).send();
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(400).json({ message: 'Erro ao deletar produto' });
  }
}

module.exports = {
  search,
  show,
  store,
  update,
  destroy
};