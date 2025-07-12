const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/cartController');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.patch('/:itemId', protect, updateCartItem);
router.delete('/:itemId', protect, removeCartItem);

module.exports = router;
