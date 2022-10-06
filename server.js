// express to run server and routes
const express = require("express");

// Start up an instance for app
const app = express();

/* Dependencies */
// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Middleware
const bodyParser = require("body-parser");
// Configure express to use body-parser as a middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// End point to gather data
let projectData = {};

/* Conect project folder with the server */
app.use(express.static("website"));

// Get routs
const getData = (req, res) => {
  res.send(projectData);
};
app.get("/all", getData);

// Post routs
const postData = (req, res) => {
  projectData = req.body;
  console.log(projectData);
  res.send(projectData);
};
app.post("/add", postData);

// Build the server
const port = 8080;
function listening() {
  console.log(`Server running on localhost : http://localhost:${port}`);
}
app.listen(port, listening);
