const vehicleModel = require('../model/vehicleModel');
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

module.exports = { handleFileUpload, deleteImage, addVehicle };
