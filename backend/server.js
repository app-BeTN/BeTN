const express = require('express');
const path = require('path');
const connectToMongoDB = require('./database/db_connection');
//const authRoutes = require('./backend/auth');

const app = express();
const PORT = 3001;

connectToMongoDB();

app.use(express.json());
//app.use(authRoutes);

// Serve le pagine frontend
app.use('/signup', express.static(path.join(__dirname, './../frontend/signup')));
app.use('/home', express.static(path.join(__dirname, './../frontend/home')));
app.use('/style', express.static(path.join(__dirname, './../frontend/style')));


// Redirect root (opzionale)
app.get('/', (req, res) => {
  res.redirect('/home/home.html');
});

app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
});