# weatherServer
A weather API server build with node JS.

The data sourced from [氣象資料開放平台](https://opendata.cwb.gov.tw/dataset/observation/O-A0003-001), and hourly fetch to the database.

Framework: 
* ES6
* NodeJS
* Express
* MongoDB
* Docker

If you can't access your mongodb as default, please change the uri in `/global/global.js` to specify the location of your mongodb
```{JavaScript}
import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017"; // <- change if you can't access your mongodb as default
const config = { useNewUrlParser: true, useUnifiedTopology: true };

export const mongoClient = new MongoClient(uri, config);
```

If connect to your mongodb successfully, you can run `npm start` and console would show the shortcut to verify the project.

Enjoy on this application!!!
