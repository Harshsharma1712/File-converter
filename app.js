const express = require("express");
const path = require("path");

const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
const converterRoutes = require("./routes/converter");
app.use("/", converterRoutes); // Use converter routes

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
