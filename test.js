const { Timestamp } = require("mongodb");
let obsTime = "2021-11-26T22:00:00+08:00";
console.log("obsTime", obsTime);
console.log("Date", Date.parse(obsTime) / 1000);
console.log("Timestamp", Timestamp(Date.parse(obsTime) / 1000));
