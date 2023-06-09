const User = require('../model/userModel');
const { success, error } = require('../utils/responseWrapper');

const getUserDetails = async (req, res) => {
    try {
        const { user } = req;
        if (user)
            res.send(success(200, { user }));
        else
            res.send(success(404, 'User not found'));
    }
    catch (e) {
        console.log(e);
        res.send(error(500, 'Internal Server Error'));
    }
}

module.exports = { getUserDetails };