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

app.get('/api/pins',  cors (), async (req, res) => {
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

app.get('/api/tags', cors (), async (req, res) => {
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

app.get('/api/domains', cors (), async (req, res) => {
  try {
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/domains", config);

    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

app.get('/api/domain/:domainId/',  cors (), async (req, res) => {
  try {
    const domainId = req.params.domainId;
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/domains/"+domainId, config);
    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});


app.get('/api/domain/:domain_name/pins',  cors (), async (req, res) => {
  try {
    const domainName = req.params.domain_name;
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/pins?filterByFormula=(domain=\""+domainName+"\")", config);
    https://api.airtable.com/v0/app7zNJoX11DY99UA/Tags?filterByFormula=AND({domain}="Maths")
    // Send the data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data'});
  }
});

app.get('/api/domain/:domain_name/tags',  cors (), async (req, res) => {
  try {
    const domainName = req.params.domain_name;
    // Make an HTTP GET request to the back-end
    const response = await axios.get(baseUrl+ "/tags?filterByFormula=(domain=\""+domainName+"\")", config);
    https://api.airtable.com/v0/app7zNJoX11DY99UA/Tags?filterByFormula=AND({domain}="Maths")
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





