const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const axios = require("axios");
const app = express();

// Middleware pour traiter les requêtes entrantes
app.use(express.json());
app.use("/", routes);
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with the specific origins you want to allow.
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
    // Make an HTTP GET request to Airtable
    const response = await axios.get(baseUrl+ "/pins", config);
    // Send the Airtable data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data from Airtable'});
  }
});

app.get('/api/tags', cors (), async (req, res) => {
  try {
    // Make an HTTP GET request to Airtable
    const response = await axios.get(baseUrl+ "/tags", config);

    // Send the Airtable data as the response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching data from Airtable'});
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});





