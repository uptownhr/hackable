var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: String, default: '0.00' },
  image_url: { type: String },
  created: { type: Date, default: Date.now() }
})

productSchema.pre('save', function (next) {
  this.price = Number(this.price.replace(/[^0-9\.]+/g, ''));
  next();
})

module.exports = mongoose.model('product', productSchema);




