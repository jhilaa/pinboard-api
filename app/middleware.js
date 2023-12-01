// middleware.js

const jwt = require('jsonwebtoken');

const extractUserMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (token) {
        try {
            console.log("req.body -------------------");
            console.log(req.body);
            console.log(process.env.JWT_SECRET);
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
    next();
};

// Exemple de middleware pour l'authentification basique
const isAuthenticated = (req, res, next) => {
    // Vérifiez si l'utilisateur est authentifié ici
    if (req.user) {
        // L'utilisateur est authentifié, continuez avec la requête
        return next();
    }
}

module.exports = {
    extractUserMiddleware, isAuthenticated
};
