const vehicleModel = require('../model/vehicleModel');
const orderModel = require('../model/orderModel');
const { success, error } = require('../utils/responseWrapper');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');

const handleFileUpload = async (req, res) => {
    try {
        if (!req.file)
            return res.send(error(400, 'file could not be uploaded'));

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        const response = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder: 'vehicles' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });

            // Pipe the buffer stream to the Cloudinary stream
            bufferStream.pipe(uploadStream);
        });

        const responseObj = {
            public_id: response.public_id,
            url: response.secure_url,
        };

        return res.status(201).send(success(201, responseObj));
    } catch (e) {
        console.log(e);
        return res.status(500).send(error(500, 'Internal Server Error'));
    }
};

const deleteImage = async (req, res) => {
    try {
        const publicId = req.body; // Get the public ID from the request parameters

        if (!publicId)
            return res.send(error(400, 'Public ID is required'));

        await cloudinary.uploader.destroy(publicId);
        return res.send(success(200, { message: 'Image deleted successfully' }));
    } catch (e) {
        console.log(e);
        return res.send(error(500, 'Internal Server Error'));
    }
};

const addVehicle = async (req, res) => {
    try {
        const { brand, category, model, price, fuel, image, registration_number } = req.body;
        const { _id } = req;


        if (!brand || !category || !model || !price || !fuel || !image || !registration_number)
            return res.send(error(400, 'All fields are required'));

        const isPresent = await vehicleModel.findOne({ registration_number });

        if (isPresent)
            return res.send(error(400, 'Vehicle already exists'));

        const vehicle = new vehicleModel({
            brand,
            category,
            model,
            price,
            fuel,
            images: image,
            registration_number,
            owner: _id
        });

        await vehicle.save();
        return res.send(success(200, { message: 'Vehicle added successfully' }));
    }
    catch (e) {
        console.log(e);
        return res.send(error(500, 'Internal Server Error'));
    }
};

const getVehicles = async (req, res) => {
    try {
        const { sort } = req.query;

        let vehicles = [];
        if (sort === 'low') {
            vehicles = await vehicleModel.find({ status: 'available' }).sort({ price: -1 });
        }
        else if (sort === 'high') {
            vehicles = await vehicleModel.find({ status: 'available' }).sort({ price: 1 });
        }
        else {
            vehicles = await vehicleModel.find({ status: 'available' });
        }
        return res.send(success(200, vehicles));
    } catch (error) {
        return res.send(error(500, 'Internal Server Error'))
    }
}

const getVehiclesOffer = async (req, res) => {
    try {
        const vehicles = await vehicleModel.find({ status: 'available' }).sort({ price: 1 }).limit(3);
        return res.send(success(200, vehicles));
    } catch (error) {
        return res.send(error(500, 'Internal Server Error'))
    }
}

const getVehicleById = async (req, res) => {

    try {
        const { id } = req.params;
        const vehicle = await vehicleModel.findById(id);
        return res.send(success(200, vehicle));
    } catch (error) {
        return res.send(error(500, 'Internal Server Error'))
    }
}

function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    console.log(a_start, a_end, b_start, b_end);
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
}

const checkAvailability = async (req, res) => {
    try {
        const { vehicle_id, date_of_booking, date_of_return } = req.body;
        const existingOrders = await orderModel.find({ vehicle: vehicle_id });


        for (const order of existingOrders) {
            const start_times1 = new Date(order.date_of_booking);
            const end_times1 = new Date(order.date_of_return);
            const start_times2 = new Date(date_of_booking);
            const end_times2 = new Date(date_of_return);

            if (dateRangeOverlaps(start_times1, end_times1, start_times2, end_times2)) {
                return res.send(success(200, { available: false, message: `Car is reserved from ${order.date_of_booking} to ${order.date_of_return}` }));
            }

        }
        return res.send(success(200, { available: true }));
    }
    catch (e) {
        console.log(e);
        return res.send(error(500, 'Internal Server Error'))
    }
}

module.exports = { handleFileUpload, deleteImage, addVehicle, getVehicles, getVehiclesOffer, getVehicleById, checkAvailability };
