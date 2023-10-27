const express = require('express');
const routes = require('./routes');
const app = express();

// Middleware pour traiter les requêtes entrantes
app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});





