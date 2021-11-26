import cron from "node-cron";
import weatherCrawler from "../crawlers/weather";
import moment from "moment";

const task = () => {
  weatherCrawler();
  console.log(`${moment().format()} weather data crawled successfully`);
};

console.log(
  "The Application will crawl the weather data from cwb API-server every hour!!!"
);

// hourly crawl data
const crontab = cron.schedule("0 * * * *", task, {
  scheduled: true,
  timezone: "Asia/Taipei",
});

export default crontab;
