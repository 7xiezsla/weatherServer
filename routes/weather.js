import { Router } from "express";
import { mongoClient } from "../global/global.js";
const weatherRouter = Router();

/* GET users listing. */
weatherRouter.get("/", (req, res, next) => {
  console.log(req.query);
  // get only CITY and TOWN from reqest
  const { CITY, TOWN } = req.query;

  const pipeline = [
    { $match: { CITY, TOWN } },
    { $sort: { obsTime: -1 } },
    { $limit: 1 },
    { $project: { _id: 0 } },
  ];

  mongoClient
    .connect()
    .then((client) => {
      const db = client.db("cwb");
      const findResult = db.collection("weather").aggregate(pipeline).toArray();
      findResult.then((data) => {
        console.log(data[0]);
        res.json(data[0]);
        client.close();
      });
    })
    .catch((err) => console.err);
});

export default weatherRouter;
