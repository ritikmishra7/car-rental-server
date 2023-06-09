const router = require('express').Router();
const authRouter = require('./authRouter');
const vehicleRouter = require('./vehicleRouter');
const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter');
const requireUser = require('../middlewares/requireUser');


router.use('/auth', authRouter);
router.use('/vehicle', requireUser, vehicleRouter);
router.use('/user', requireUser, userRouter);
router.use('/order', requireUser, orderRouter);

module.exports = router;