const Cart = require('../models/Cart');

// Get cart items for logged-in user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart ? cart.items : []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, name, price, image, quantity } = req.body;

  if (!productId || !name || !price || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, image, quantity });
    }

    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ message: 'Quantity is required' });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.remove();
    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
