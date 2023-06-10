const router = require('express').Router();
const requireUser = require('../middlewares/requireUser');
const { getOrder } = require('../controllers/orderController');

router.get('/', requireUser, getOrder)

module.exports = router;