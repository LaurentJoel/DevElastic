const express = require('express');
const esRouter = require('./routes/es.routes');

const app = express();
app.use(express.json());

app.use('/api/es', esRouter);

app.listen(31100, () => {
  console.log('Serveur API démarré sur le port 31100');
});