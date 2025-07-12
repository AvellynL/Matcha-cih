const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  namaPenerima: { type: String, required: true },
  nomorHP: { type: String, required: true },
  alamat: { type: String, required: true },
  menu: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      namaMenu: { type: String, required: true },
      harga: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  metodeBayar: { 
    type: String, 
    enum: ['Gopay', 'Dana', 'BRI', 'BCA', 'Mandiri', 'BNI'], 
    required: true 
  },
  status: { type: String, default: 'Not Delivered' },
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
