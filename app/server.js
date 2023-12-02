const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const {router, users} = require("./routes/auth");
const { extractUserMiddleware } = require('./middleware');
const passport = require('passport');
const path = require("path");
require('./passport-config')(passport);

console.log("-- test -------")

// Middleware
app.use(express.json());
app.use('/auth', router);
app.use(passport.initialize());
app.use(cors());
app.use(cookieParser());  // Utilisation du middleware cookie-parser
app.use(extractUserMiddleware);


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // '*' for the 1st tests.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


const apiKey = process.env.API_TOKEN;
const baseUrl = process.env.API_URL;
const config = {
    headers: {
        'Authorization': `Bearer ${apiKey}`,
    },
};

// Middleware pour gérer les erreurs 404
/*
app.use((req, res, next) => {
    // Redirigez vers la page d'accueil si la route demandée n'existe pas
    res.redirect('/accueil.html');
});
 */

// Utiliser l'objet users dans une route
app.get('/api/user', (req, res) => {
    console.log('-- user ---------')
    console.log(req.user)
    const user = req.user;
    res.json(user);
});


app.get('/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('You have accessed a protected route!');
});

app.post("/token", (req, res) => {
    const {refreshToken} = req.body;
    const user = users.find((u) => u.refreshToken === refreshToken);
    if (!user) {
        return res.status(403).json({message: "Invalid refresh token"});
    }
    //...
});



app.get('/api/pin/all', passport.authenticate('jwt', {session: false}), cors(), async (req, res) => {
    try {
        console.log("-- /api/pin/all -------")
        // Vérifier si les informations de l'utilisateur sont disponibles dans req.user
        if (req.user) {
            // Ajoutez des informations spécifiques de l'utilisateur à votre requête axios si nécessaire
            config.headers['User-Info'] = req.user.username;
            console.log("req.user.username");
            console.log(req.user.username);
        }
        // Make an HTTP GET request to the back-end
        const response = await axios.get(baseUrl + "/pins", config);
        // Send the data as the response to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

app.get('/api/tag/all', cors(), async (req, res) => {
    console.log("-- /api/tag/all _-------")
    try {
        // Make an HTTP GET request to the back-end
        const response = await axios.get(baseUrl + "/tags", config);

        // Send the data as the response to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

app.get('/api/domain/all', cors(), async (req, res) => {
    try {
        // Make an HTTP GET request to the back-end
        const response = await axios.get(baseUrl + "/domains", config);

        // Send the data as the response to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

app.get('/api/domain/:domain/pins', cors(), async (req, res) => {
    try {
        const domainName = req.params.domain;
        // Make an HTTP GET request to the back-end
        const getUrl = baseUrl + "/pins?filterByFormula=AND({domain}=\"" + domainName + "\")";
        const response = await axios.get(getUrl, config);
        // Send the data as the response to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching data'});
    }
});

app.get('login', cors(), async (req, res) => {
        try {

        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Error fetching data'});
        }
    }
)
app.get('/api/domain/:domain/tags', cors(), async (req, res) => {
    try {
        const domainName = req.params.domain;
        // Make an HTTP GET request to the back-end
        const getUrl = baseUrl + "/tags?filterByFormula=AND({domain}=\"" + domainName + "\")";
        const response = await axios.get(getUrl, config);
        // Send the data as the response to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching data'});
    }
});



// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
    // Redirigez vers la page d'accueil ou de connexion si la route demandée n'existe pas
    res.redirect(req.isAuthenticated() ? '/accueil.html' : '/login.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
});





