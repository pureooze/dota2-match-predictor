const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
const fs = require("fs");

const API = require("./api.json");
const utils = require("./utils.js");

app.use(bodyParser.json());

app.get("/api", function(req, respond) {
  const url = `https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v001?key=${
    API.key
  }&skill=${API.skillLevel}&min_players=${API.minPlayers}`;
  console.log(url);

  https.get(url, response => {
    let data = "";

    // A chunk of data has been recieved.
    response.on("data", chunk => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    response.on("end", async () => {
      //   console.log(JSON.parse(data));
      const result = await utils.parseData(JSON.parse(data).result);

      fs.writeFile("./response.json", JSON.stringify(result, null, 4), err => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File has been created");
      });
      respond.json(result);
    });
  });
});

// Start the server
var server = app.listen(3000, function() {
  console.log("Server listening...");
});
