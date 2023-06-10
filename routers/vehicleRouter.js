const router = require('express').Router();
const requireUser = require('../middlewares/requireUser');
const vehicleController = require('../controllers/vehicleController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/add-picture', requireUser, upload.single('files'), vehicleController.handleFileUpload);
router.delete('/delete-picture', requireUser, vehicleController.deleteImage);
router.post('/add-vehicle', requireUser, vehicleController.addVehicle);
router.get('/get-vehicles', requireUser, vehicleController.getVehicles);
router.get('/get-vehicles-offer', requireUser, vehicleController.getVehiclesOffer);
router.get('/get-vehicle/:id', requireUser, vehicleController.getVehicleById);
router.post('/check-availability', requireUser, vehicleController.checkAvailability);


module.exports = router;