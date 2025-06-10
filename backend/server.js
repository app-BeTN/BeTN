const express = require('express');
const path = require('path');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const connectToMongoDB = require('./database/db_connection');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// conessione db
connectToMongoDB();

// collegamento api
app.use(authRoutes);     // /api/signup, /api/check-nome, /api/me
app.use(eventRoutes);    // /api/events, /event/:id

// collegamento al frontend 
app.use('/creaEvento', express.static(path.join(__dirname, './../frontend/creaEvento')));
app.use('/evento', express.static(path.join(__dirname, './../frontend/evento')));
app.use('/signup', express.static(path.join(__dirname, './../frontend/signup')));
app.use('/home', express.static(path.join(__dirname, './../frontend/home')));
app.use('/editEvento', express.static(path.join(__dirname, './../frontend/editEvento')));
app.use('/cardsEventi', express.static(path.join(__dirname, './../frontend/cardsEventi')));
app.use('/style', express.static(path.join(__dirname, './../frontend/style')));
app.use('/login', express.static(path.join(__dirname, './../frontend/login')));
app.use('/assets', express.static(path.join(__dirname, './../frontend/assets')));
app.use('/profile',express.static(path.join(__dirname, '../frontend/profile')));

// endpoint root
app.get('/', (req, res) => {
  res.redirect('/home/home.html');
});

// swagger
const port = process.env.PORT || 3000;
const host = process.env.HOST;
const swaggerDoc = YAML.load(path.join(__dirname, '../openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// server
app.listen(port, () => {
  console.log(`🚀 Webapp: http://${host}:${port}`);
  console.log(`🔘 Swagger: http://${host}:${port}/api-docs`);
});
