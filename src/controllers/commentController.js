const Comment = require('../models/Comment');
const Post    = require('../models/Post');

// Público: comentarios aprobados de un post
const getByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, approved: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Autenticado: crear comentario
const create = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim())
      return res.status(400).json({ error: 'El comentario no puede estar vacío' });

    const post = await Post.findOne({ _id: req.params.postId, status: 'published' });
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });

    const comment = await Comment.create({
      post: post._id,
      author: req.user.id,
      content: content.trim(),
    });

    const populated = await comment.populate('author', 'name');
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Admin: todos los comentarios
const getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.approved !== undefined) filter.approved = req.query.approved === 'true';
    const comments = await Comment.find(filter)
      .populate('author', 'name email')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Admin: aprobar/rechazar
const setApproval = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved: req.body.approved },
      { new: true }
    );
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json(comment);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Admin o autor del comentario: eliminar
const remove = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    if (req.user.role !== 'admin' && comment.author.toString() !== req.user.id)
      return res.status(403).json({ error: 'Sin permiso' });

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comentario eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getByPost, create, getAll, setApproval, remove };
