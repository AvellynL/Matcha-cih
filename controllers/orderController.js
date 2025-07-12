const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { namaPenerima, nomorHP, alamat, menu, metodeBayar, totalPrice } = req.body;

    console.log('Received order data:', req.body);

    if (!namaPenerima || !nomorHP || !alamat || !menu || !metodeBayar || totalPrice === undefined) {
      console.error('Validation failed: Missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newOrder = new Order({
      user: req.user._id,
      namaPenerima,
      nomorHP,
      alamat,
      menu,
      metodeBayar,
      totalPrice
    });

    const savedOrder = await newOrder.save();
    console.log('Order saved:', savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get orders by user
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status to "Delivered"
exports.markOrderDone = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: 'Delivered' },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
