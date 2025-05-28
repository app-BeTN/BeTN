const express = require('express');
const path = require('path');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const connectToMongoDB = require('./database/db_connection');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const loginRoutes = require('./routes/login');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectToMongoDB();
app.use('/creaEvento', express.static(path.join(__dirname, './../frontend/creaEvento')));
app.use('/evento', express.static(path.join(__dirname, './../frontend/evento')));
app.use('/signup', express.static(path.join(__dirname, './../frontend/signup')));
app.use('/home', express.static(path.join(__dirname, './../frontend/home')));
app.use('/style', express.static(path.join(__dirname, './../frontend/style')));
app.use('/login', express.static(path.join(__dirname, './../frontend/login')));
app.use(authRoutes);
app.use(eventRoutes);
app.use(loginRoutes);

const port = process.env.PORT;
const host = process.env.HOST;

app.get('/', (req, res) => {
  res.redirect('/home/home.html');
});
app.listen(port, () => {
  console.log(`🚀 Webapp: http://${host}:${port}`);
});

const swaggerDoc = YAML.load(path.join(__dirname, '../openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.listen(port, () => {
  console.log(`🔘 Swagger: http://${host}:${port}/api-docs`);
});
