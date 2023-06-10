const router = require('express').Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const requireUser = require('../middlewares/requireUser');

router.post('/create-order', requireUser, createOrder)
router.post('/payment-verification', verifyPayment)

module.exports = router;