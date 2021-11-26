import { mongoClient } from "../global/global.js";

const tokenChecker = (req, res, next) => {
  const { apikey } = req.query;
  mongoClient.connect().then((client) => {
    const db = client.db("cwb");
    const findResult = db.collection("token").count({ token: apikey });
    findResult.then((result) => {
      if (result === 1) {
        next();
      } else {
        res.send("Invalid Token! please use the apikey given in console.");
        // res.sendStatus(401);
      }
    });
  });
};

export default tokenChecker;
