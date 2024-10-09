// /app/api/getData/route.js
import { InfluxDB } from "@influxdata/influxdb-client";

export interface ControllerData {
  time: string,
  value: number | string
  field: string
}

export async function GET() {
  const url = process.env.INFLUXDB_URL || "http://localhost:8086";
  const token = process.env.INFLUXDB_TOKEN || "your-influxdb-token";
  const org = process.env.INFLUXDB_ORG || "your-org";
  const bucket = process.env.INFLUXDB_BUCKET || "your-bucket";

  const influxDB = new InfluxDB({ url, token });
  const queryApi = influxDB.getQueryApi(org);

  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -7d)
      |> filter(fn: (r) => r._measurement == "controller_data")
      |> filter(fn: (r) => r._field == "currentTemp" or r._field == "currentGravity")
      |> yield(name: "mean")
  `;

  const data: ControllerData[] = [];

  return new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        data.push({
          time: o._time,
          value: o._value,
          field: o._field,
        });
      },
      error(error) {
        console.error("Error querying InfluxDB:", error);
        reject(
          new Response(JSON.stringify({ error: "Failed to query InfluxDB" }), {
            status: 500,
          })
        );
      },
      complete() {
        resolve(new Response(JSON.stringify(data), { status: 200 }));
      },
    });
  });
}
