const orderModel = require("../model/orderModel");
const { success, error } = require("../utils/responseWrapper");


const getOrder = async (req, res) => {
    try {
        const order = await orderModel.find({ user: req._id }).populate('vehicle').populate('user').select('-signature').select('-order_id').select('-receipt');
        res.send(success(200, order));
    } catch (e) {
        console.log(e);
        res.send(error(500, 'Something went wrong'));
    }
}

module.exports = { getOrder };