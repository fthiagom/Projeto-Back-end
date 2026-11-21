const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const {
  sequelize,
  Product,
  Category,
  ProductImage,
  ProductOption,
  ProductCategory
} = require('../models');

const ALLOWED_FIELDS = [
  'id',
  'enabled',
  'name',
  'slug',
  'use_in_menu',
  'stock',
  'description',
  'price',
  'price_with_discount',
  'category_ids',
  'images',
  'options'
];

const PRODUCT_TABLE_FIELDS = [
  'id',
  'enabled',
  'name',
  'slug',
  'use_in_menu',
  'stock',
  'description',
  'price',
  'price_with_discount'
];

function parseRadius(radius) {
  if (radius === undefined || radius === null || radius === '') {
    return 0;
  }
  if (typeof radius === 'number') {
    return Number.isInteger(radius) && radius >= 0 ? radius : NaN;
  }
  const cleaned = String(radius).replace(/px$/i, '').trim();
  const parsed = Number(cleaned);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : NaN;
}

function normalizeOptionValues(option) {
  const rawValues = option.values !== undefined ? option.values : option.value;
  if (Array.isArray(rawValues)) {
    return rawValues.map((v) => String(v).trim()).filter(Boolean).join(',');
  }
  if (typeof rawValues === 'string') {
    return rawValues.split(',').map((v) => v.trim()).filter(Boolean).join(',');
  }
  return '';
}

function saveBase64Image(content, type = 'image/png', productId = 'temp', index = 0) {
  const uploadsDir = path.resolve(__dirname, '../../public/media');
  fs.mkdirSync(uploadsDir, { recursive: true });

  const extMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif'
  };
  const ext = extMap[type] || 'png';
  const base64Data = String(content).replace(/^data:image\/\w+;base64,/, '');
  const filename = `product-${productId}-${Date.now()}-${index}.${ext}`;
  const fullPath = path.join(uploadsDir, filename);

  fs.writeFileSync(fullPath, Buffer.from(base64Data, 'base64'));
  return `/media/${filename}`;
}

function resolveImagePath(imageItem, productId, index) {
  if (!imageItem || typeof imageItem.content !== 'string' || !imageItem.content.trim()) {
    return null;
  }
  const content = imageItem.content.trim();
  if (content.startsWith('http://') || content.startsWith('https://') || content.startsWith('/')) {
    return content;
  }
  return saveBase64Image(content, imageItem.type, productId, index);
}

function formatProduct(productInstance, selectedFields = ALLOWED_FIELDS) {
  const plain = productInstance.toJSON();
  const categoryIds = Array.isArray(plain.categories)
    ? plain.categories.map((c) => c.id)
    : [];

  const images = Array.isArray(plain.images)
    ? plain.images.map((img) => ({
        id: img.id,
        content: img.path
      }))
    : [];

  const options = Array.isArray(plain.options)
    ? plain.options.map((opt) => ({
        id: opt.id,
        product_id: opt.product_id,
        title: opt.title,
        shape: opt.shape,
        radius: opt.radius,
        type: opt.type,
        values: opt.values
      }))
    : [];

  const fullObject = {
    id: plain.id,
    enabled: Boolean(plain.enabled),
    name: plain.name,
    slug: plain.slug,
    stock: plain.stock,
    description: plain.description,
    price: plain.price,
    price_with_discount: plain.price_with_discount,
    category_ids: categoryIds,
    images,
    options
  };

  if (plain.use_in_menu !== undefined) {
    fullObject.use_in_menu = Boolean(plain.use_in_menu);
  }

  const filtered = {};
  for (const field of selectedFields) {
    if (Object.prototype.hasOwnProperty.call(fullObject, field)) {
      filtered[field] = fullObject[field];
    }
  }
  return filtered;
}

async function searchProducts(query = {}) {
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

  let selectedFields = ALLOWED_FIELDS;
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
    selectedFields = requested;
  }

  const where = {};

  if (query.match !== undefined && String(query.match).trim() !== '') {
    const term = `%${String(query.match).trim()}%`;
    where[Op.or] = [
      { name: { [Op.like]: term } },
      { description: { [Op.like]: term } }
    ];
  }

  if (query['price-range'] !== undefined && String(query['price-range']).trim() !== '') {
    const parts = String(query['price-range']).split('-').map((v) => Number(v.trim()));
    if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) {
      const error = new Error('Parâmetro price-range inválido');
      error.statusCode = 400;
      throw error;
    }
    const [minPrice, maxPrice] = parts;
    where.price = { [Op.between]: [minPrice, maxPrice] };
  }

  const include = [
    {
      model: Category,
      as: 'categories',
      attributes: ['id'],
      through: { attributes: [] },
      required: false
    },
    {
      model: ProductImage,
      as: 'images',
      attributes: ['id', 'path', 'enabled'],
      required: false
    },
    {
      model: ProductOption,
      as: 'options',
      attributes: ['id', 'product_id', 'title', 'shape', 'radius', 'type', 'values'],
      required: false
    }
  ];

  if (query.category_ids !== undefined && String(query.category_ids).trim() !== '') {
    const categoryIds = String(query.category_ids)
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isInteger(id) && id > 0);

    if (categoryIds.length === 0) {
      const error = new Error('Parâmetro category_ids inválido');
      error.statusCode = 400;
      throw error;
    }

    include[0] = {
      model: Category,
      as: 'categories',
      attributes: ['id'],
      through: { attributes: [] },
      where: { id: { [Op.in]: categoryIds } },
      required: true
    };
  }

  const optionFilters = [];
  if (query.option && typeof query.option === 'object') {
    for (const [optionIdRaw, rawFilterVal] of Object.entries(query.option)) {
      const optionId = Number(optionIdRaw);
      const filterValues = String(rawFilterVal || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      if (!Number.isInteger(optionId) || optionId <= 0 || filterValues.length === 0) {
        const error = new Error('Parâmetro option inválido');
        error.statusCode = 400;
        throw error;
      }

      const valueConditions = filterValues.map((val) => ({
        values: { [Op.like]: `%${val}%` }
      }));

      optionFilters.push({
        id: optionId,
        [Op.or]: valueConditions
      });
    }
  }

  if (optionFilters.length > 0) {
    include[2] = {
      model: ProductOption,
      as: 'options',
      attributes: ['id', 'product_id', 'title', 'shape', 'radius', 'type', 'values'],
      where: { [Op.and]: optionFilters },
      required: true
    };
  }

  const dbAttributes = PRODUCT_TABLE_FIELDS.filter((col) => selectedFields.includes(col));
  if (!dbAttributes.includes('id')) {
    dbAttributes.unshift('id');
  }

  const countResult = await Product.findAll({
    where,
    include,
    attributes: ['id'],
    distinct: true
  });
  const total = countResult.length;

  const findOptions = {
    where,
    include,
    attributes: dbAttributes,
    order: [['id', 'ASC']],
    distinct: true
  };

  if (rawLimit !== -1) {
    findOptions.limit = rawLimit;
    findOptions.offset = (rawPage - 1) * rawLimit;
  }

  const rows = await Product.findAll(findOptions);
  const data = rows.map((row) => formatProduct(row, selectedFields));

  return {
    data,
    total,
    limit: rawLimit,
    page: rawLimit === -1 ? 1 : rawPage
  };
}

async function getProductById(id) {
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return null;
  }

  const product = await Product.findByPk(productId, {
    include: [
      {
        model: Category,
        as: 'categories',
        attributes: ['id'],
        through: { attributes: [] }
      },
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'path', 'enabled']
      },
      {
        model: ProductOption,
        as: 'options',
        attributes: ['id', 'product_id', 'title', 'shape', 'radius', 'type', 'values']
      }
    ]
  });

  if (!product) return null;
  return formatProduct(product, ALLOWED_FIELDS);
}

async function createProduct(payload = {}) {
  const {
    enabled,
    name,
    slug,
    use_in_menu,
    stock,
    description,
    price,
    price_with_discount,
    category_ids,
    images,
    options
  } = payload;

  if (
    !name ||
    typeof name !== 'string' ||
    !name.trim() ||
    !slug ||
    typeof slug !== 'string' ||
    !slug.trim() ||
    price === undefined ||
    Number.isNaN(Number(price)) ||
    price_with_discount === undefined ||
    Number.isNaN(Number(price_with_discount))
  ) {
    const error = new Error('Campos obrigatórios do produto inválidos');
    error.statusCode = 400;
    throw error;
  }

  const transaction = await sequelize.transaction();

  try {
    const product = await Product.create(
      {
        enabled: enabled !== undefined ? Boolean(enabled) : false,
        name: name.trim(),
        slug: slug.trim(),
        use_in_menu: use_in_menu !== undefined ? Boolean(use_in_menu) : false,
        stock: stock !== undefined ? Number(stock) : 0,
        description: description !== undefined ? String(description) : null,
        price: Number(price),
        price_with_discount: Number(price_with_discount)
      },
      { transaction }
    );

    if (Array.isArray(category_ids) && category_ids.length > 0) {
      const links = category_ids.map((categoryId) => ({
        product_id: product.id,
        category_id: Number(categoryId)
      }));
      await ProductCategory.bulkCreate(links, { transaction });
    }

    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i += 1) {
        const img = images[i];
        const imgPath = resolveImagePath(img, product.id, i);
        if (!imgPath) {
          const error = new Error('Imagem do produto inválida');
          error.statusCode = 400;
          throw error;
        }
        await ProductImage.create(
          {
            product_id: product.id,
            enabled: img.enabled !== undefined ? Boolean(img.enabled) : false,
            path: imgPath
          },
          { transaction }
        );
      }
    }

    if (Array.isArray(options) && options.length > 0) {
      for (const opt of options) {
        const parsedRadius = parseRadius(opt.radius);
        const normalizedValues = normalizeOptionValues(opt);

        if (!opt.title || Number.isNaN(parsedRadius) || !normalizedValues) {
          const error = new Error('Opção do produto inválida');
          error.statusCode = 400;
          throw error;
        }

        await ProductOption.create(
          {
            product_id: product.id,
            title: String(opt.title).trim(),
            shape: opt.shape || 'square',
            radius: parsedRadius,
            type: opt.type || 'text',
            values: normalizedValues
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    return getProductById(product.id);
  } catch (err) {
    await transaction.rollback();
    if (!err.statusCode) {
      err.statusCode = 400;
    }
    throw err;
  }
}

async function updateProduct(id, payload = {}) {
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error('ID de produto inválido');
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    const error = new Error('Produto não encontrado');
    error.statusCode = 404;
    throw error;
  }

  const {
    enabled,
    name,
    slug,
    use_in_menu,
    stock,
    description,
    price,
    price_with_discount,
    category_ids,
    images,
    options
  } = payload;

  if (
    name !== undefined &&
    (typeof name !== 'string' || !name.trim())
  ) {
    const error = new Error('Nome do produto inválido');
    error.statusCode = 400;
    throw error;
  }

  if (
    slug !== undefined &&
    (typeof slug !== 'string' || !slug.trim())
  ) {
    const error = new Error('Slug do produto inválido');
    error.statusCode = 400;
    throw error;
  }

  const transaction = await sequelize.transaction();

  try {
    const updates = {};
    if (enabled !== undefined) updates.enabled = Boolean(enabled);
    if (name !== undefined) updates.name = name.trim();
    if (slug !== undefined) updates.slug = slug.trim();
    if (use_in_menu !== undefined) updates.use_in_menu = Boolean(use_in_menu);
    if (stock !== undefined) updates.stock = Number(stock);
    if (description !== undefined) updates.description = String(description);
    if (price !== undefined) updates.price = Number(price);
    if (price_with_discount !== undefined) {
      updates.price_with_discount = Number(price_with_discount);
    }

    await product.update(updates, { transaction });

    if (Array.isArray(category_ids)) {
      await ProductCategory.destroy({
        where: { product_id: product.id },
        transaction
      });
      if (category_ids.length > 0) {
        const links = category_ids.map((categoryId) => ({
          product_id: product.id,
          category_id: Number(categoryId)
        }));
        await ProductCategory.bulkCreate(links, { transaction });
      }
    }

    if (Array.isArray(images)) {
      for (let i = 0; i < images.length; i += 1) {
        const img = images[i];
        if (img.id && img.deleted) {
          await ProductImage.destroy({
            where: { id: Number(img.id), product_id: product.id },
            transaction
          });
        } else if (img.id) {
          const imgUpdates = {};
          if (img.enabled !== undefined) imgUpdates.enabled = Boolean(img.enabled);
          if (img.content !== undefined) {
            const resolved = resolveImagePath(img, product.id, i);
            if (!resolved) {
              const error = new Error('Imagem inválida na atualização');
              error.statusCode = 400;
              throw error;
            }
            imgUpdates.path = resolved;
          }
          await ProductImage.update(imgUpdates, {
            where: { id: Number(img.id), product_id: product.id },
            transaction
          });
        } else {
          const resolved = resolveImagePath(img, product.id, i);
          if (!resolved) {
            const error = new Error('Imagem inválida na criação');
            error.statusCode = 400;
            throw error;
          }
          await ProductImage.create(
            {
              product_id: product.id,
              enabled: img.enabled !== undefined ? Boolean(img.enabled) : false,
              path: resolved
            },
            { transaction }
          );
        }
      }
    }

    if (Array.isArray(options)) {
      for (const opt of options) {
        if (opt.id && opt.deleted) {
          await ProductOption.destroy({
            where: { id: Number(opt.id), product_id: product.id },
            transaction
          });
        } else if (opt.id) {
          const optUpdates = {};
          if (opt.title !== undefined) optUpdates.title = String(opt.title).trim();
          if (opt.shape !== undefined) optUpdates.shape = opt.shape;
          if (opt.type !== undefined) optUpdates.type = opt.type;
          if (opt.radius !== undefined) {
            const parsedRadius = parseRadius(opt.radius);
            if (Number.isNaN(parsedRadius)) {
              const error = new Error('Radius inválido na opção');
              error.statusCode = 400;
              throw error;
            }
            optUpdates.radius = parsedRadius;
          }
          if (opt.values !== undefined || opt.value !== undefined) {
            const normalizedValues = normalizeOptionValues(opt);
            if (!normalizedValues) {
              const error = new Error('Valores inválidos na opção');
              error.statusCode = 400;
              throw error;
            }
            optUpdates.values = normalizedValues;
          }

          await ProductOption.update(optUpdates, {
            where: { id: Number(opt.id), product_id: product.id },
            transaction
          });
        } else {
          const parsedRadius = parseRadius(opt.radius);
          const normalizedValues = normalizeOptionValues(opt);
          if (!opt.title || Number.isNaN(parsedRadius) || !normalizedValues) {
            const error = new Error('Nova opção do produto inválida');
            error.statusCode = 400;
            throw error;
          }

          await ProductOption.create(
            {
              product_id: product.id,
              title: String(opt.title).trim(),
              shape: opt.shape || 'square',
              radius: parsedRadius,
              type: opt.type || 'text',
              values: normalizedValues
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    if (!err.statusCode) {
      err.statusCode = 400;
    }
    throw err;
  }
}

async function deleteProduct(id) {
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error('ID de produto inválido');
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    const error = new Error('Produto não encontrado');
    error.statusCode = 404;
    throw error;
  }

  const transaction = await sequelize.transaction();
  try {
    await ProductCategory.destroy({ where: { product_id: product.id }, transaction });
    await ProductImage.destroy({ where: { product_id: product.id }, transaction });
    await ProductOption.destroy({ where: { product_id: product.id }, transaction });
    await product.destroy({ transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

module.exports = {
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};