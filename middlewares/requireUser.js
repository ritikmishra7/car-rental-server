const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const { success, error } = require('../utils/responseWrapper');

module.exports = async (req, res, next) => {

    if (!req.headers?.authorization?.startsWith("Bearer"))
        return res.send(error(401, 'Authorization is required'));

    const accessToken = req.headers.authorization.split(" ")[1];

    try {
        const verifiedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        req._id = verifiedToken._id;
        const user = await User.findById(req._id);
        req.user = user;
        if (!user)
            return res.send(error(404, 'User not found'));
        next();
    } catch (e) {
        console.log(e);
        return res.send(error(401, 'Invalid access key'));
    }

}