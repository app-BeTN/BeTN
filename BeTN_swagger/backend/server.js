// backend/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

// importa la tua funzione di connessione
const connectToMongoDB = require('./database/db_connection');

// 1) inizializza Express
const app = express();
app.use(cors());
app.use(express.json());

// 2) connettiti a MongoDB
connectToMongoDB();

// 3) monta Swagger UI su /api-docs
// 1) Monta prima tutte le API
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/login'));
app.use('/api', require('./routes/event'));

 // 2) Solo **dopo** le API, monta Swagger UI su /api-docs
 const swaggerDoc = YAML.load(path.join(__dirname, '../openapi.yaml'));
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// 4) monta le tue route API (adatta i require se hai cartelle diverse)


// 6) avvia il server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}/api-docs`);
});