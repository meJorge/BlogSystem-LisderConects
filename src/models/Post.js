const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  content:     { type: String, required: true },
  excerpt:     { type: String, default: '' },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  tags:        [{ type: String, trim: true, lowercase: true }],
  status:      { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  publishedAt: { type: Date, default: null },
  scheduledAt: { type: Date, default: null },
  coverImage:  { type: String, default: '' },
  views:       { type: Number, default: 0 },
}, { timestamps: true });

postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model('Post', postSchema);
