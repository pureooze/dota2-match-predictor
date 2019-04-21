const fs = require("fs");
const response = require("./response.json");
const API = require("./api.json");
const heroes = require("./heroes.json").result.heroes;

function getPlayerHeroes(players) {
  const playerHeroes = {
    radiant: [],
    dire: []
  };

  for (const player of players) {
    if (player.player_slot < 128) {
      playerHeroes.radiant.push(player.hero_id);
    } else {
      playerHeroes.dire.push(player.hero_id);
    }
  }

  return playerHeroes;
}

function getHeroData(players) {
  const playerData = {};
  const playerHeroes = getPlayerHeroes(players);

  for (const hero of heroes) {
    const heroId = player.hero_id;

    if (playerHeroes.radiant.includes(hero.id)) {
      playerData[`randiant_${heroId}_item0`] = player.item_0;
      playerData[`randiant_${heroId}_item1`] = player.item_1;
      playerData[`randiant_${heroId}_item2`] = player.item_2;
      playerData[`randiant_${heroId}_item3`] = player.item_3;
      playerData[`randiant_${heroId}_item4`] = player.item_4;
      playerData[`randiant_${heroId}_item5`] = player.item_5;
      playerData[`randiant_${heroId}_deaths`] = player.deaths;
      playerData[`randiant_${heroId}_denies`] = player.denies;
      playerData[`randiant_${heroId}_assists`] = player.assists;
      playerData[`randiant_${heroId}_kills`] = player.kills;
      playerData[`randiant_${heroId}_kills_per_min`] = player.kills_per_min;

      for (let i = 0; i < API.maxLevel; i++) {
        if (
          player.ability_upgrades_arr &&
          player.ability_upgrades_arr[i] !== undefined
        ) {
          playerData[`radiant_${heroId}_l${i}`] =
            player.ability_upgrades_arr[i];
        } else {
          playerData[`radiant_${heroId}_l${i}`] = 0;
        }
      }
    }
  }

  return playerData;
}

function getPlayerData(players) {
  const heroesInGame = [];
  for (const player of players) {
    heroesInGame.push({ id: player.hero_id });
  }

  return heroesInGame;
}

function parseData() {
  const data = [];

  for (const match of response) {
    if (Array.isArray(match.players)) {
      let matchData = {};

      // for (const player of match.players) {
      //   matchData = Object.assign(matchData, getPlayerData(player));
      // }

      // heroesInGame = getPlayerData(match.players);

      matchData = Object.assign(matchData, getHeroData(match.players));

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
