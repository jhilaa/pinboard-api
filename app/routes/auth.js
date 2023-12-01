const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const crypto = require('crypto');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const users = [];

const isAuthenticated = (req, res, next) => {
    // Vérifiez si l'utilisateur est authentifié ici
    if (req.user) {
        // L'utilisateur est authentifié, continuez avec la requête
        return next();
    }
}

/*
// Middleware pour extraire l'utilisateur du jeton JWT
const extractUserMiddleware = (req, res, next) => {
    const bearerToken = req.header('Authorization');
    if (bearerToken) {
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
                res.status(401).json({message: 'Unauthorized'});
            }
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }
    }
    next();

};
 */

router.use(cors());
router.use(cookieParser());
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
        console.log ("** LOGIN 1")
        const user = users.find((u) => u.username === username);
        //const refreshToken = crypto.randomBytes(64).toString('hex');
        //user.refreshToken = refreshToken;
        console.log ("** LOGIN 2")
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        console.log ("** LOGIN 3")
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log ("** LOGIN 4")
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
        console.log ("** LOGIN 5")

        //res.cookie('token', token, { httpOnly: true });
        //res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true });
        res.cookie('token', token, { httpOnly: true, secure: true });
        console.log ("** LOGIN 6")
        //res.json({ message: "Logged in successfully", token, refreshToken  });
        res.json({ message: "Logged in successfully", token  });
        console.log ("** LOGIN 7")
    } catch (e) {
        console.log(e.message);
        ("** LOGIN 8")
    }
});



// middleware d'extraction de l'utilisateur
//router.use(extractUserMiddleware);
router.use(isAuthenticated);

module.exports = { router, users ,
    isAuthenticated};