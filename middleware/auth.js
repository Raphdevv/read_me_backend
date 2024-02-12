const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_ACCESS_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}

function generateToken(user, exp, iat) {
    const payload = {
    sub: user,
    exp: exp,
    iat: iat,
  };
    return jwt.sign(payload, process.env.JWT_SECRET_ACCESS_KEY, {  algorithm: "HS256" });
}

module.exports = { verifyToken, generateToken };
