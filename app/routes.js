require('dotenv').config();
var http = require('http');
var https = require('https');
var express = require('express');
const cors = require('cors');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Route pour effectuer une requête HTTP sortante avec un token dans les en-têtes
router.get('/api', async (req, res) => {
    try {
        console.log("******************* process.env.TOKEN : " + process.env.TOKEN)
        // Replace 'YOUR_API_KEY' with your Airtable API key
        const apiKey = /*process.env.TOKEN;*/ 'pateoiLGxeeOa1bbO.7d97dd01a0d5282f7e4d3b5fff9c9e10d2023d3a34b1811e1152a97182c2238d';
        const baseUrl = 'https://api.airtable.com/v0/app7zNJoX11DY99UA/Pins';
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




