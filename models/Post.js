var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now() },
  title: { type: String },
  content: { type: String },
  status: { type: String, enum: ['pending', 'launched', 'queued'] },

  _author: { type: mongoose.Schema.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('post', postSchema)
