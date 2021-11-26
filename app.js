import express from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import logger from "morgan";
import { v4 as uuidv4 } from "uuid";

import tokenChecker from "./middleWares/tokenChecker.js";
import { mongoClient } from "./global/global.js";
import crontab from "./cron/crontab";
import weatherRouter from "./routes/weather";

crontab.start();
const userId = uuidv4();
jwt.sign({ userId }, "apikey", (err, token) => {
  if (err) throw err;
  mongoClient.connect().then((client) => {
    const db = client.db("cwb");
    const insertResult = db.collection("token").insertOne({ userId, token });
    insertResult.then((result) => {
      console.log(
        "\x1b[33m%s\x1b[0m",
        "Access weather data with apikey as below:"
      );
      console.log(token);

      console.log("\x1b[33m%s\x1b[0m", "Shortcut as below:");
      console.log("\x1b[30m\x1b[42m%s\x1b[0m", "Authorized");
      console.log(
        `http://localhost:3000/weather?CITY=臺北市&TOWN=南港區&apikey=${token}`
      );
      console.log("\x1b[30m\x1b[41m%s\x1b[0m", "Unauthorized");
      console.log(`http://localhost:3000/weather?CITY=臺北市&TOWN=南港區`);
      client.close();
    });
  });
});

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use(tokenChecker);
app.use("/weather", weatherRouter);

app.listen(3000, () => {
  console.log("\x1b[32mlistening on http://localhost:3000");
});
