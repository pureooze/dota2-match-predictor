const https = require("https");

const API = require("./api.json");

async function getMatchDetails(url) {
  const request = new Promise((res, err) => {
    setTimeout(() => {
      https.get(url, response => {
        let data = "";

        // A chunk of data has been recieved.
        response.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on("end", () => {
          //   console.log(JSON.parse(data));
          //   const result = JSON.parse(data);
          res(JSON.parse(data));
        });
      });
    }, 1500);
  });

  return request;
}

async function parseData(data) {
  const results = [];

  console.log("Data: ", data);
  for (let i = 0; i < 10; i++) {
    const url = `https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v001?key=${
      API.key
    }&match_id=${data.matches[i].match_id}`;

    const result = await getMatchDetails(url);
    // console.log("Res: ", result);
    results.push(result);
  }

  return results;
}

module.exports = {
  parseData
};
