const router = require('express').Router();
const { authenticate, isAdmin } = require('../middlewares/auth');
const { getByPost, create, getAll, setApproval, remove } = require('../controllers/commentController');

// Público
router.get('/post/:postId',  getByPost);

// Autenticado
router.post('/post/:postId', authenticate, create);
router.delete('/:id',        authenticate, remove);

// Admin
router.get('/',               authenticate, isAdmin, getAll);
router.patch('/:id/approval', authenticate, isAdmin, setApproval);

module.exports = router;
