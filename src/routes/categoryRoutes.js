const router = require('express').Router();
const { getAll, create, remove } = require('../controllers/categoryController');
const { authenticate, isAdmin }  = require('../middlewares/auth');

router.get('/',       getAll);
router.post('/',      authenticate, isAdmin, create);
router.delete('/:id', authenticate, isAdmin, remove);

module.exports = router;
