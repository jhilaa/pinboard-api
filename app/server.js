const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // '*' for the 1st tests.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


const apiKey = process.env.API_TOKEN;
const baseUrl = process.env.API_URL ;
const config = {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  },
};

app.get('/api/pin/all',  cors (), async (req, res) => {
  console.log ("-- /api/pin/all -------")
  try {
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/pins", config);
    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

app.get('/api/tag/all', cors (), async (req, res) => {
  console.log ("-- /api/tag/all -------")
  try {
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/tags", config);

    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

app.get('/api/domain/all', cors (), async (req, res) => {
  try {
    console.log ("-- /api/domain/all -------")
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/domains", config);

    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

app.get('/api/domain/:domain/pins',  cors (), async (req, res) => {
  try {
    const domainName = req.params.domain;
    // Make an HTTP GET request to the back-end
    const getUrl = baseUrl+ "/pins?filterByFormula=AND({domain}=\""+domainName+"\")";
    const response = await axios.get(getUrl, config);
    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

app.get('/api/domain/:domain/tags',  cors (), async (req, res) => {
  try {
    const domainName = req.params.domain;
    // Make an HTTP GET request to the back-end
    const getUrl =baseUrl+ "/tags?filterByFormula=AND({domain}=\""+domainName+"\")";
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
    //const getUrl = "https://api.airtable.com/v0/app7zNJoX11DY99UA/groups?filterByFormula=(domain=\"Maths\")&sort%5B0%5D%5Bfield%5D=order&sort%5B0%5D%5Bdirection%5D=desc"
    const response = await axios.get(getUrl, config);
    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});





