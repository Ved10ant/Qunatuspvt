const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled' },
  content: { type: String, default: '{}' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
    }
  }
});

module.exports = mongoose.model('Post', postSchema);
