const fs = require("fs");
const response = require("./response.json");
const API = require("./api.json");

function getPlayerData(player) {
  const playerData = {};
  const playerSlot = player.player_slot;
  playerData[`p${playerSlot}_heroid`] = player.hero_id;
  playerData[`p${playerSlot}_item0`] = player.item_0;
  playerData[`p${playerSlot}_item1`] = player.item_1;
  playerData[`p${playerSlot}_item2`] = player.item_2;
  playerData[`p${playerSlot}_item3`] = player.item_3;
  playerData[`p${playerSlot}_item4`] = player.item_4;
  playerData[`p${playerSlot}_item5`] = player.item_5;
  playerData[`p${playerSlot}_deaths`] = player.deaths;
  playerData[`p${playerSlot}_denies`] = player.denies;
  playerData[`p${playerSlot}_assists`] = player.assists;
  playerData[`p${playerSlot}_kills`] = player.kills;
  playerData[`p${playerSlot}_kills_per_min`] = player.kills_per_min;

  for (let i = 0; i < API.maxLevel; i++) {
    if (
      player.ability_upgrades_arr &&
      player.ability_upgrades_arr[i] !== undefined
    ) {
      playerData[`player_${player.player_slot}_l${i}`] =
        player.ability_upgrades_arr[i];
    } else {
      playerData[`player_${player.player_slot}_l${i}`] = 0;
    }
  }

  return playerData;
}

function parseData() {
  const data = [];

  for (const match of response) {
    if (Array.isArray(match.players)) {
      let matchData = {};

      for (const player of match.players) {
        matchData = Object.assign(matchData, getPlayerData(player));
      }

      matchData = Object.assign(matchData, {
        class: match.radiant_win ? 1 : 0
      });

      data.push(matchData);
    }
  }

  return data;
}

fs.writeFile(
  "./trainingData.json",
  JSON.stringify(parseData(), null, 4),
  err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File has been created");
  }
);
