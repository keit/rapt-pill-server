const express = require("express");
const next = require("next");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const { url, token, org, bucket } = require("./influxConfig");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
// Middleware to parse JSON body
app.use(express.json());

// Use environment variables for configuration
const url = process.env.INFLUXDB_URL;
const token = process.env.INFLUXDB_TOKEN;
const org = process.env.INFLUXDB_ORG;
const bucket = process.env.INFLUXDB_BUCKET;

const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket, 'ms');

// Prepare Next.js
nextApp.prepare().then(() => {
  // Define any API routes first
  app.post("/pillData", (req, res) => {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ message: "invalid data" });
    }
    const point = new Point("controller_data")
      .floatField("currentTemp", data.currentTemp)
      .floatField("currentGravity", data.currentGravity)
      .booleanField("heaterStatus", data.heaterStatus)
      .floatField("heaterThreshold", data.heaterThreshold)
      .floatField("battery", data.battery)
      .intField("memory", data.memory);
    writeApi.writePoint(point);
    // Handle your API endpoint logic here (e.g., receiving data from Arduino)
    res.status(200).json({ message: "success" });
  });

  // Serve Next.js pages
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // Close InfluxDB connection when the process exits
  process.on("exit", () => {
    writeApi
      .close()
      .then(() => {
        console.log("InfluxDB write API closed");
      })
      .catch((err) => {
        console.error("Error closing InfluxDB write API:", err);
      });
  });

  app.listen(3000, (err) => {
    if (err) throw err;
    console.log("Server ready on http://localhost:3000");
  });
});
