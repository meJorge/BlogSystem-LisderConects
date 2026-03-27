const Post = require('../models/Post');

const slugify = (s) =>
  s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 80);

const getPublished = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const filter = { status: 'published' };
    if (req.query.search)   filter.$text    = { $search: req.query.search };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.tag)      filter.tags     = req.query.tag;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name')
        .populate('category', 'name slug color')
        .sort({ publishedAt: -1 })
        .skip(skip).limit(limit)
        .select('-content'),
      Post.countDocuments(filter),
    ]);

    res.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getBySlug = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name bio').populate('category', 'name slug color');

    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getAll = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 10);
    const skip   = (page - 1) * limit;

    // Admin ve todos; autor solo los suyos
    const filter = req.user.role === 'admin' ? {} : { author: req.user.id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$text  = { $search: req.query.search };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name')
        .populate('category', 'name')
        .sort({ updatedAt: -1 })
        .skip(skip).limit(limit)
        .select('title slug status publishedAt scheduledAt views tags createdAt updatedAt author'),
      Post.countDocuments(filter),
    ]);

    res.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getOne = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name').populate('category', 'name slug');
    if (!post) return res.status(404).json({ error: 'No encontrado' });

    // Autor solo puede ver sus propios posts
    if (req.user.role !== 'admin' && post.author._id.toString() !== req.user.id)
      return res.status(403).json({ error: 'Sin permiso' });

    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status, scheduledAt, coverImage } = req.body;
    if (!title || !content)
      return res.status(400).json({ error: 'Título y contenido son obligatorios' });

    let slug = slugify(title);
    if (await Post.findOne({ slug })) slug = `${slug}-${Date.now()}`;

    const tagsArr = Array.isArray(tags)
      ? tags : (tags ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []);

    const finalStatus  = status || 'draft';
    const publishedAt  = finalStatus === 'published' ? new Date() : null;
    const scheduledDate = finalStatus === 'scheduled' && scheduledAt ? new Date(scheduledAt) : null;

    const post = await Post.create({
      title, content, slug,
      excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 200),
      author: req.user.id,
      category: category || null,
      tags: tagsArr,
      status: finalStatus,
      publishedAt,
      scheduledAt: scheduledDate,
      coverImage: coverImage || '',
    });

    res.status(201).json(await post.populate('author', 'name'));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'No encontrado' });

    if (req.user.role !== 'admin' && post.author.toString() !== req.user.id)
      return res.status(403).json({ error: 'Sin permiso' });

    const { title, content, excerpt, category, tags, status, scheduledAt, coverImage } = req.body;

    if (title)   { post.title = title; post.slug = slugify(title); }
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (category !== undefined) post.category = category || null;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags !== undefined)
      post.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

    if (status) {
      post.status = status;
      if (status === 'published' && !post.publishedAt) post.publishedAt = new Date();
      if (status === 'scheduled' && scheduledAt) post.scheduledAt = new Date(scheduledAt);
    }

    await post.save();
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'No encontrado' });

    if (req.user.role !== 'admin' && post.author.toString() !== req.user.id)
      return res.status(403).json({ error: 'Sin permiso' });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Publicación eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getPublished, getBySlug, getAll, getOne, create, update, remove };
