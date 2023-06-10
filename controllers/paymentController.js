const { v4: uuidv4 } = require('uuid');
const { success, error } = require('../utils/responseWrapper');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const orderModel = require('../model/orderModel');



const createOrder = async (req, res) => {
    try {
        const { amount, vehicle_id, price, total_price, license_number, from, to, date_of_booking, date_of_return } = req.body;
        const receipt = uuidv4();
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt,
        }

        //razorpay configuration
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const response = await instance.orders.create(options);

        const order = new orderModel({
            vehicle: vehicle_id,
            user: req.user._id,
            price,
            total_price,
            license_number,
            receipt,
            from,
            to,
            date_of_booking,
            date_of_return,
            order_id: response.id,
        });
        await order.save();
        res.send(success(201, response));
    } catch (e) {
        console.log(e);
        res.send(error(500, 'Something went wrong'));
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const check = razorpay_order_id + '|' + razorpay_payment_id;
        console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(check.toString())
            .digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;
        if (!isSignatureValid) {
            return res.send(error(400, 'Payment verification failed'));
        }

        //Database comes here
        const order = await orderModel.findOne({ order_id: razorpay_order_id });
        if (!order) {
            return res.send(error(400, 'Order not found'));
        }
        order.payment_status = 'paid';
        order.payment_id = razorpay_payment_id;
        order.signature = razorpay_signature;
        await order.save();
        res.redirect(`${process.env.CORS_ORIGIN}/payment-success?reference=${razorpay_payment_id}`)
    }
    catch (e) {
        console.log(e);
        res.send(error(500, 'Something went wrong'));
    }
}

module.exports = { createOrder, verifyPayment };
