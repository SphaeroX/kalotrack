const express = require("express");
const compression = require("compression");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();


// Aktiviere Gzip-Komprimierung für Textressourcen
app.use(compression());

app.use(express.json());

const port = process.env.PORT || 3000;

global.openaiApiKey = process.env.OPENAI_API_KEY;
global.chatGptModel = process.env.CHATGPT_MODEL;

// Aktiviere CORS für alle Anfragen bei DEBUG
if (process.env.DEBUG == "true") {
  app.use(cors());
}

const apiRoutes = require(path.join(__dirname, "server", "routes", "index.js"));

app.use("/api", apiRoutes);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "dist" directory
app.use(
  express.static(path.join(__dirname, "dist"), { maxAge: 7 * 24 * 60 * 60 })
);

/* Fallback-Middleware für Vue Router */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
/* 
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
*/
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
