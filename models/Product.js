const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  namaMenu: { type: String, required: true },
  harga: { type: Number, required: true },
  picture: { type: String, required: true },
  deskripsi: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
