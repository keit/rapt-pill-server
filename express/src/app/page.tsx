"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ControllerData } from "./api/getData/route";

export default function Home() {
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/getData");
      const data: ControllerData[] = await response.json();

      const userLocale = navigator.language || "en-US"; // Fallback to 'en-US' if locale is not available

      const tempData = data
        .filter((d) => d.field === "currentTemp")
        .map((d) => ({
          x: new Date(d.time).toLocaleString(userLocale),
          y: d.value,
        }));
      const gravityData = data
        .filter((d) => d.field === "currentGravity")
        .map((d) => ({
          x: new Date(d.time).toLocaleString(userLocale),
          y: d.value,
        }));

      setChartData({
        datasets: [
          {
            label: "Temperature (°C)",
            data: tempData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
          {
            label: "Gravity",
            data: gravityData,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true,
          },
        ],
      });
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Temperature and Gravity Data</h1>
      <Line data={chartData} />
    </div>
  );
}
