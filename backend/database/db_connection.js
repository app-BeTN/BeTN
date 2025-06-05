const mongoose = require('mongoose');
require('dotenv').config();

const user = encodeURIComponent(process.env.DB_USER);
const pass = encodeURIComponent(process.env.DB_PASS);
const host = process.env.DB_HOST;
const name = process.env.DB_NAME;

// stringa di connessione
const uri = `mongodb+srv://${user}:${pass}@${host}/${name}?retryWrites=true&w=majority`;

//connessione al database
async function connectToMongoDB() {
  try {
    await mongoose.connect(uri, {
    });
    console.log('✅ Connesso a MongoDB');
  } catch (err) {
    console.error('Errore connessione MongoDB:', err);
  }
}

module.exports = connectToMongoDB;
