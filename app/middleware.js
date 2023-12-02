// middleware.js

const jwt = require('jsonwebtoken');

// Middleware pour extraire l'utilisateur du jeton JWT
const extractUserMiddleware = (req, res, next) => {
    const bearerToken = req.header('Authorization');
    if (bearerToken.startsWith("Bearer ")) {
        try {
            const token = bearerToken.substring(7, bearerToken.length);
            console.log("req.body ++++++++++++++++");
            console.log(req.body);
            console.log(process.env.JWT_SECRET);
            console.log("token");
            console.log(token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Error decoding JWT:', error.message);
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { extractUserMiddleware};