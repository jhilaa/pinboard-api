const express = require('express');
const routes = require('./routes');
const cors = require("cors");
const app = express();

// Middleware pour activer CORS
app.use(cors());

// Middleware pour traiter les requêtes entrantes
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin",
      "*");
  res.setHeader("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "" +
      "GET, POST, PUT, DELETE, OPTIONS");
})

// Routes
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
