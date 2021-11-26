import moment from "moment";
import { mongoClient } from "../global/global.js";
import request from "request";

const dataid = "O-A0003-001";
const Authorization = "CWB-FEC8B013-82B5-4F3E-B658-91C457CD56A2";
const format = "json";

const url = `https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/${dataid}?Authorization=${Authorization}&format=${format}`;
const weatherCrawler = () => {
  request({ url, method: "GET" }, (err, res, body) => {
    if (err) throw err;

    const jsonBody = JSON.parse(body);

    let data = jsonBody.cwbopendata.location || [];
    console.log(`rawdata: ${data.length}`);
    if (data.length === 0) {
      console.log("request fail");
      return;
    }
    const validLocations = ["臺北市", "新北市", "桃園市"];
    data = data.filter((record) =>
      validLocations.includes(record.parameter[0].parameterValue)
    );

    console.log(`validdata: ${data.length}`);
    // data transform
    data = data.map((record) => {
      const { stationId, locationName } = record;
      const lat = +record.lat;
      const lon = +record.lon;
      const lat_wgs84 = +record.lat_wgs84;
      const lon_wgs84 = +record.lon_wgs84;
      const obsTime = record.time.obsTime;

      const newRecord = {
        stationId,
        locationName,
        lat,
        lon,
        lat_wgs84,
        lon_wgs84,
        obsTime,
      };
      record.weatherElement.forEach(
        (obj) => (newRecord[obj.elementName] = obj.elementValue.value)
      );
      record.parameter.forEach(
        (obj) => (newRecord[obj.parameterName] = obj.parameterValue)
      );
      return newRecord;
    });

    mongoClient
      .connect()
      .then((client) => {
        const db = client.db("cwb");
        const result = db.collection("weather").insertMany(data);
        result.then((insertResult) => {
          db.collection("crawl_log")
            .insertOne(insertResult)
            .then((logResult) => {
              console.log(`${moment().format()} crawl successed`);
              client.close();
            });
        });
      })
      .catch((err) => console.err);
  });
};

export default weatherCrawler;
