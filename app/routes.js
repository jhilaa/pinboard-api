require('dotenv').config();
var http = require('http');
var https = require('https');
var express = require('express');
const cors = require('cors');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Route pour effectuer une requête HTTP sortante avec un token dans les en-têtes
router.get('/api/pins', async (req, res) => {
    try {
        const apiKey = process.env.TOKEN;
        const baseUrl = process.env.PATH;
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
    try {
        const apiKey = process.env.TOKEN;
        const baseUrl = process.env.HOSTNAME;
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




