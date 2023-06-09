const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/details', userController.getUserDetails);
module.exports = router;