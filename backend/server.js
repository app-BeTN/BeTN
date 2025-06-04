const express = require('express');
const path = require('path');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const connectToMongoDB = require('./database/db_connection');

// Questi path restano identici a prima, salvo spostamento dei file
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
const eventRoutes = require('./routes/event');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connessione a MongoDB
connectToMongoDB();

// **ROUTES**: mantieni l’ordine di prima, ora però sono route “ridirette” ai nuovi Controllers
app.use(authRoutes);     // /api/signup, /api/check-nome, /api/me
app.use(loginRoutes);    // /api/login
app.use(eventRoutes);    // /api/events, /event/:id

// Resto delle statiche front-end (resta tutto com’era)
app.use('/creaEvento', express.static(path.join(__dirname, './../frontend/creaEvento')));
app.use('/evento', express.static(path.join(__dirname, './../frontend/evento')));
app.use('/signup', express.static(path.join(__dirname, './../frontend/signup')));
app.use('/home', express.static(path.join(__dirname, './../frontend/home')));
app.use('/style', express.static(path.join(__dirname, './../frontend/style')));
app.use('/login', express.static(path.join(__dirname, './../frontend/login')));
app.use('/assets', express.static(path.join(__dirname, './../frontend/assets')));

// Endpoint root
app.get('/', (req, res) => {
  res.redirect('/home/home.html');
});

// SWAGGER
const port = process.env.PORT || 3000;
const host = process.env.HOST;
const swaggerDoc = YAML.load(path.join(__dirname, '../openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// AVVIA server
app.listen(port, () => {
  console.log(`🚀 Webapp: http://${host}:${port}`);
  console.log(`🔘 Swagger: http://${host}:${port}/api-docs`);
});
