const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/v1/user/token', userController.token);
router.get('/v1/user/:id', userController.show);
router.post('/v1/user', userController.store);
router.put('/v1/user/:id', authMiddleware, userController.update);
router.delete('/v1/user/:id', authMiddleware, userController.destroy);

module.exports = router;