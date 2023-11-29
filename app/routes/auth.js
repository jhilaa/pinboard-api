const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const crypto = require('crypto');

const users = [];

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
    next();
};

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // '*' for the 1st tests.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


router.post("/register", async (req, res) => {
    try {
        console.log("** REGISTER **");
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        users.push(newUser);

        res
            .status(201)
            .json({ message: "User registered successfully", user: newUser });
    } catch (e) {
        console.log(e.message);
    }
});

router.post("/login", async (req, res) => {
    console.log ("** LOGIN **")
    try {
        const { username, password } = req.body;

        const user = users.find((u) => u.username === username);
        const refreshToken = crypto.randomBytes(64).toString('hex');
        user.refreshToken = refreshToken;

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.json({ message: "Logged in successfully", token, refreshToken  });
    } catch (e) {
        console.log(e.message);
    }
});


// middleware d'extraction de l'utilisateur
router.use(extractUserMiddleware);

module.exports = { router, users , extractUserMiddleware};