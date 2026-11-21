const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.get('/v1/category/search', categoryController.search);
router.get('/v1/category/:id', categoryController.show);
router.post('/v1/category', authMiddleware, categoryController.store);
router.put('/v1/category/:id', authMiddleware, categoryController.update);
router.delete('/v1/category/:id', authMiddleware, categoryController.destroy);

module.exports = router;