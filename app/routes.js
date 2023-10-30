require('dotenv').config();
var express = require('express');
const router = express.Router();
const axios = require('axios');

// Route pour effectuer une requête HTTP sortante avec un token dans les en-têtes
router.get('/api/pins', async (req, res) => {
    try {
        const apiKey = process.env.API_TOKEN;
        const baseUrl = process.env.API_URL + "/pins";
        const config = {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        };

        // Make an HTTP GET request to Airtable
        const response = await axios.get(baseUrl, config);

        // Send the Airtable data as the response to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching data from Airtable'});
    }
});

router.get('/api/tags', async (req, res) => {
    console.log ("=========== process.env.API_URL ===========")
    console.log (process.env.API_URL);
    console.log ("------------------------");
    console.log (req.headers);
    console.log ("=========================");
    try {
        const apiKey = process.env.API_TOKEN;
        const baseUrl = process.env.API_URL + "/tags";
        const config = {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        };

        // Make an HTTP GET request to Airtable
        const response = await axios.get(baseUrl, config);

        // Send the Airtable data as the response to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching data from Airtable'});
    }
});

module.exports = router;




