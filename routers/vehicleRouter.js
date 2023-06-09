const router = require('express').Router();
const requireUser = require('../middlewares/requireUser');
const vehicleController = require('../controllers/vehicleController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/add-picture', requireUser, upload.single('files'), vehicleController.handleFileUpload);
router.delete('/delete-picture', requireUser, vehicleController.deleteImage);
router.post('/add-vehicle', requireUser, vehicleController.addVehicle);


module.exports = router;