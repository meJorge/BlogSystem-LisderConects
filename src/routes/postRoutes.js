const router = require('express').Router();
const { authenticate } = require('../middlewares/auth');
const {
  getPublished, getBySlug,
  getAll, getOne, create, update, remove,
} = require('../controllers/postController');

// Público
router.get('/public',       getPublished);
router.get('/public/:slug', getBySlug);

// Autenticado (autor o admin)
router.get('/',       authenticate, getAll);
router.get('/:id',    authenticate, getOne);
router.post('/',      authenticate, create);
router.put('/:id',    authenticate, update);
router.delete('/:id', authenticate, remove);

module.exports = router;
