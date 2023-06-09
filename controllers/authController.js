const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { success, error } = require('../utils/responseWrapper');

const signupController = async (req, res) => {
    try {

        const { email, first_name, last_name, phone, password } = req.body;

        if (!email && !first_name && !last_name && !phone && !password)
            return res.send(error(400, 'All fields are required'));
        else if (!email)
            return res.send(error(400, 'Email is required'));
        else if (!first_name)
            return res.send(error(400, 'first_name is required'));
        else if (!last_name)
            return res.send(error(400, 'last_name is required'));
        else if (!phone)
            return res.send(error(400, 'Phone is required'));
        else if (!password)
            return res.send(error(400, 'Password is required'));
        else {

            const oldUser1 = await User.findOne({ email });
            if (oldUser1)
                return res.send(error(409, 'User is already registered'));

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                email,
                first_name,
                last_name,
                phone,
                password: hashedPassword
            });
            const newUser = {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt,
            }
            return res.send(success(201, newUser));
        }
    } catch (e) {
        console.log(e);
    }
}


const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email && !password)
            return res.send(error(400, 'All fields are required'));
        else if (!email)
            return res.send(error(400, 'Email is required'));
        else if (!password)
            return res.send(error(400, 'Password is required'));
        else {
            const oldUser1 = await User.findOne({ email }).select('+password');
            if (!oldUser1)
                return res.send(error(409, 'User is not registered'));

            let matched;
            if (oldUser1) {
                matched = await bcrypt.compare(password, oldUser1.password);
            }

            if (!matched)
                return res.send(error(403, 'Incorrect Password'));


            const accessToken = generateAccessTokens(oldUser1);
            const refreshToken = generateRefreshTokens(oldUser1);

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: true
            })
            delete oldUser1.password;
            return res.send(success(201, { user: oldUser1, accessToken }));
        }
    } catch (e) {
        console.log(e);
        return res.send(error(404, "Technical Error"))
    }
}

const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        });

        return res.send(success(200, 'user logged out'));

    } catch (e) {
        return res.send(error(500, e.message))
    }
}

//This api will refresh or generate a new access token if refresh token is still valid
const refreshAccessToken = async (req, res) => {
    console.log("refreshAccessToken called");
    const cookies = req.cookies;
    if (!cookies.jwt) {
        return res.send(error(401, 'Refresh Token is required'));
    }

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);

        const data = {
            _id: decoded._id,
        };
        const accessToken = generateAccessTokens(data);
        return res.send(success(201, { accessToken }));
    } catch (e) {
        console.log(e);
        return res.send(error(401, 'Invalid refresh token'));
    }

};



//Internal Functions
function generateAccessTokens(data) {
    try {
        const accessToken = jwt.sign({ _id: data._id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: '1d'
        });
        return accessToken;
    } catch (e) {
        console.log(e);
    }
}

function generateRefreshTokens(data) {
    try {
        const accessToken = jwt.sign({ _id: data._id }, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: '30d'
        });
        return accessToken;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { signupController, loginController, refreshAccessToken, logoutController };