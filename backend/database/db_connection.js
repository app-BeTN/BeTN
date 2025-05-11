
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://belnic03nb:betndatabase@betn-db.zrpk9fl.mongodb.net/";
const client = new MongoClient(uri);

async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db("betn");
}

module.exports = { connectDB };
