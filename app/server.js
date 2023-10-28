const express = require('express');
const routes = require('./routes');
const cors = require("cors");
const app = express();

// Middleware pour traiter les requêtes entrantes
app.use(express.json());
app.use("/", routes);
app.use(cors());

// Middleware pour activer CORS
app.use((req, res, next) => {
  // Permettre l'accès depuis l'origine de la requête
  res.header('Access-Control-Allow-Origin', req.get('Origin'));
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); // Si nécessaire pour les requêtes avec des cookies
  res.header
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});





