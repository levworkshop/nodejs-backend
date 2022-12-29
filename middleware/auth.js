const jwt = require('jsonwebtoken');
const config = require('../config/dev');

module.exports = (req, res, next) => {
    if (req.path.includes('login') ||
        req.path.includes('customers') &&
        req.method.toLowerCase() === 'post') {
        next();
        return;
    }

    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. please login');

    try {
        jwt.verify(token, config.JWT_SECRET);
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).send('Access denied. please login');
    }
}