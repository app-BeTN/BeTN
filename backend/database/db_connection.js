const mongoose = require('mongoose');

async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb+srv://belnic03nb:betndatabase@betn-db.zrpk9fl.mongodb.net/BeTN', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connesso a MongoDB');
  } catch (err) {
    console.error('Errore connessione MongoDB:', err);
  }
}

module.exports = connectToMongoDB;
