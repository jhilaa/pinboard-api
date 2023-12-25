const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const {router, users} = require("./routes/auth");
const { extractUserMiddleware, test } = require('./middleware');
const passport = require('passport');
const path = require("path");
require('./passport-config')(passport);

console.log("-- test -------")


// Middleware for handling errors and 404
app.use((req, res, next) => {
    return res.redirect('/login.html');
});
// Middleware
//app.use('/routes/auth', router);
app.use(express.json());
app.use(passport.initialize());
app.use(cors());
app.use(cookieParser());
app.use(test);
app.use(extractUserMiddleware);

// List of routes that should be accessible without authentication
const publicRoutes = ['/login', '/accueil', '/404', '/000'];




/*
app.use((req, res, next) => {
    console.log('** Middleware Start **');
    console.log('Requested URL:', req.url);
    console.log('Public Routes:', publicRoutes);
    console.log ("** TEST **")

    // Check if the requested route is in the list of public routes
    if (publicRoutes.includes(req.path)) {
        return next(); // Allow access without authentication
    }

    console.log ("** req.user **")
    console.log (req.user)
    // Redirect to login page if user is not authenticated
    //if (!req.user) {
    if (true) {
        console.log ("** REDIRECT **")
        return res.redirect('/login.html');
    }

    // Send the 404.html file for authenticated users if the route doesn't exist
    res.status(404).sendFile('000.html', { root: path.join(__dirname, 'public') });
});
*/

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

app.get('/api/domain/:domain/groups', cors(), async (req, res) => {
    try {
        const domainName = req.params.domain;
        // Make an HTTP GET request to the back-end
        const getUrl = baseUrl + "/groups?filterByFormula=(domain=\"" + domainName + "\")&sort%5B0%5D%5Bfield%5D=order&sort%5B0%5D%5Bdirection%5D=desc";
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




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
});





