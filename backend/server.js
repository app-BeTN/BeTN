const express = require('express');
const path = require('path');
const connectToMongoDB = require('./database/db_connection');
const authRoutes = require('./routes/auth');
const eventRoutes = require("./routes/event");

const app = express();
const PORT = 3000;

connectToMongoDB();

app.use(express.json());

// Serve le pagine frontend
app.use('/creaEvento', express.static(path.join(__dirname, './../frontend/creaEvento')));
app.use('/evento', express.static(path.join(__dirname, './../frontend/evento')));
app.use('/signup', express.static(path.join(__dirname, './../frontend/signup')));
app.use('/home', express.static(path.join(__dirname, './../frontend/home')));
app.use('/style', express.static(path.join(__dirname, './../frontend/style')));
app.use(authRoutes);
app.use(eventRoutes);

// Redirect root (opzionale)
app.get('/', (req, res) => {
  res.redirect('/home/home.html');
});

app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
});