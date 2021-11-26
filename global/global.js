import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017"; // <- change if you can't access your mongodb as default
const config = { useNewUrlParser: true, useUnifiedTopology: true };

// In this time, the syntax strange as below but work.
// Maybe wait for official fix
export const mongoClient = new MongoClient(uri, config);
