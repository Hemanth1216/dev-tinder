const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authAdmin = async (req, res, next) => {
    try {
        const cookies = req?.cookies;
        const { token } = cookies;
        if(!token) {
            throw new Error("No token");
        }
        const decodedMessage = await jwt.verify(token, "devtinder@123");
        const { _id } = decodedMessage;
        if(!_id) {
            throw new Error("token is not valid");
        }
        const user = await User.findById(_id);
        if(!user) {
            throw new Error("Token is not valid");
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(401).send(err.message);
    }
}

module.exports = {
    authAdmin
}