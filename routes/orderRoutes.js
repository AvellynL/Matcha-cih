const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/user', protect, orderController.getOrdersByUser);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/done', orderController.markOrderDone);

module.exports = router;
