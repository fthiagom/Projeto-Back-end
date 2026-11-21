const { Router } = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.get('/v1/product/search', productController.search);
router.get('/v1/product/:id', productController.show);
router.post('/v1/product', authMiddleware, productController.store);
router.put('/v1/product/:id', authMiddleware, productController.update);
router.delete('/v1/product/:id', authMiddleware, productController.destroy);

module.exports = router;