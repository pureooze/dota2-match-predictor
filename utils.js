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
          res(JSON.parse(data).result);
        });
      });
    }, 400);
  });

  return request;
}

function getFilteredResults(result) {
  const filteredResults = {
    class: result.radiant_win ? 1 : 0,
    radiant_score: result.radiant_score,
    dire_score: result.dire_score
  };

  for (const player of result.players) {
    filteredResults[`player_${player.player_slot}`] = player.hero_id;
    filteredResults[`player_${player.player_slot}_gold_per_min`] =
      player.gold_per_min;
    filteredResults[`player_${player.player_slot}_xp_per_min`] =
      player.xp_per_min;
    filteredResults[`player_${player.player_slot}_kills`] = player.kills;
    filteredResults[`player_${player.player_slot}_deaths`] = player.deaths;
    filteredResults[`player_${player.player_slot}_assists`] = player.assists;
    filteredResults[`player_${player.player_slot}_denies`] = player.denies;

    for (let i = 0; i < API.maxLevel; i++) {
      if (player.ability_upgrades && player.ability_upgrades[i] !== undefined) {
        filteredResults[`player_${player.player_slot}_l${i}`] =
          player.ability_upgrades[i].ability;
      } else {
        filteredResults[`player_${player.player_slot}_l${i}`] = 0;
      }
    }
  }

  return filteredResults;
}

async function parseData(data) {
  const results = [];

  console.log("Data: ", data);
  for (let i = 0; i < API.matchLimit && i < data.matches.length; i++) {
    const url = `https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v001?key=${
      API.key
    }&match_id=${data.matches[i].match_id}`;

    const result = await getMatchDetails(url);
    results.push(getFilteredResults(result));
  }

  return results;
}

module.exports = {
  parseData
};
