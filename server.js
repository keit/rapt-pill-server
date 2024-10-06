const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();

// Prepare Next.js
nextApp.prepare().then(() => {
  // Define any API routes first
  app.get("/data", (req, res) => {
    // Handle your API endpoint logic here (e.g., receiving data from Arduino)
    res.json({ message: "API received data" });
  });

  // Serve Next.js pages
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(3000, (err) => {
    if (err) throw err;
    console.log("Server ready on http://localhost:3000");
  });
});
