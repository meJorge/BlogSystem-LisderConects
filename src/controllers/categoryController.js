const Category = require('../models/Category');

const slugify = (s) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const getAll = async (req, res) => {
  try {
    res.json(await Category.find().sort({ name: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
    const cat = await Category.create({ name: name.trim(), slug: slugify(name), color: color || '#1d9bf0' });
    res.status(201).json(cat);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Ya existe esa categoría' });
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Categoría eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, create, remove };
