const { Category } = require('../models');

const ALLOWED_FIELDS = ['id', 'name', 'slug', 'use_in_menu'];

function parseBooleanQuery(value) {
  if (value === undefined) return undefined;
  if (value === 'true' || value === '1' || value === true) return true;
  if (value === 'false' || value === '0' || value === false) return false;
  return null;
}

async function searchCategories(query = {}) {
  const rawLimit = query.limit !== undefined ? Number(query.limit) : 12;
  const rawPage = query.page !== undefined ? Number(query.page) : 1;

  if (!Number.isInteger(rawLimit) || rawLimit < -1 || rawLimit === 0) {
    const error = new Error('Parâmetro limit inválido');
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(rawPage) || rawPage < 1) {
    const error = new Error('Parâmetro page inválido');
    error.statusCode = 400;
    throw error;
  }

  const where = {};
  if (query.use_in_menu !== undefined) {
    const parsedMenu = parseBooleanQuery(query.use_in_menu);
    if (parsedMenu === null) {
      const error = new Error('Parâmetro use_in_menu inválido');
      error.statusCode = 400;
      throw error;
    }
    where.use_in_menu = parsedMenu;
  }

  let attributes = ALLOWED_FIELDS;
  if (query.fields !== undefined) {
    const requested = String(query.fields)
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    if (requested.length === 0 || requested.some((f) => !ALLOWED_FIELDS.includes(f))) {
      const error = new Error('Parâmetro fields contém campo inválido');
      error.statusCode = 400;
      throw error;
    }
    attributes = requested;
  }

  const total = await Category.count({ where });

  const findOptions = {
    where,
    attributes,
    order: [['id', 'ASC']]
  };

  if (rawLimit !== -1) {
    findOptions.limit = rawLimit;
    findOptions.offset = (rawPage - 1) * rawLimit;
  }

  const rows = await Category.findAll(findOptions);

  const data = rows.map((row) => {
    const item = row.toJSON();
    if (Object.prototype.hasOwnProperty.call(item, 'use_in_menu')) {
      item.use_in_menu = Boolean(item.use_in_menu);
    }
    return item;
  });

  return {
    data,
    total,
    limit: rawLimit,
    page: rawLimit === -1 ? 1 : rawPage
  };
}

async function getCategoryById(id) {
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return null;
  }

  const category = await Category.findByPk(categoryId, {
    attributes: ALLOWED_FIELDS
  });

  if (!category) return null;

  const data = category.toJSON();
  data.use_in_menu = Boolean(data.use_in_menu);
  return data;
}

async function createCategory({ name, slug, use_in_menu }) {
  if (!name || typeof name !== 'string' || !name.trim() || !slug || typeof slug !== 'string' || !slug.trim()) {
    const error = new Error('Os campos name e slug são obrigatórios');
    error.statusCode = 400;
    throw error;
  }

  let menuValue = false;
  if (use_in_menu !== undefined) {
    const parsedMenu = parseBooleanQuery(use_in_menu);
    if (parsedMenu === null) {
      const error = new Error('O campo use_in_menu deve ser booleano');
      error.statusCode = 400;
      throw error;
    }
    menuValue = parsedMenu;
  }

  const created = await Category.create({
    name: name.trim(),
    slug: slug.trim(),
    use_in_menu: menuValue
  });

  return {
    id: created.id,
    name: created.name,
    slug: created.slug,
    use_in_menu: Boolean(created.use_in_menu)
  };
}

async function updateCategory(id, { name, slug, use_in_menu }) {
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    const error = new Error('ID de categoria inválido');
    error.statusCode = 400;
    throw error;
  }

  if (!name || typeof name !== 'string' || !name.trim() || !slug || typeof slug !== 'string' || !slug.trim()) {
    const error = new Error('Os campos name e slug são obrigatórios');
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findByPk(categoryId);
  if (!category) {
    const error = new Error('Categoria não encontrada');
    error.statusCode = 404;
    throw error;
  }

  const updatePayload = {
    name: name.trim(),
    slug: slug.trim()
  };

  if (use_in_menu !== undefined) {
    const parsedMenu = parseBooleanQuery(use_in_menu);
    if (parsedMenu === null) {
      const error = new Error('O campo use_in_menu deve ser booleano');
      error.statusCode = 400;
      throw error;
    }
    updatePayload.use_in_menu = parsedMenu;
  }

  await category.update(updatePayload);
}

async function deleteCategory(id) {
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    const error = new Error('ID de categoria inválido');
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findByPk(categoryId);
  if (!category) {
    const error = new Error('Categoria não encontrada');
    error.statusCode = 404;
    throw error;
  }

  await category.destroy();
}

module.exports = {
  searchCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};