const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
// Middleware to parse JSON body
app.use(express.json());

// Prepare Next.js
nextApp.prepare().then(() => {
  // Define any API routes first
  app.post("/pillData", (req, res) => {
    console.log(req.body);
    // Handle your API endpoint logic here (e.g., receiving data from Arduino)
    res.json({});
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
