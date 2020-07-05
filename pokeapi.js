const axios = require("axios").default;
const allPokemon = require("./completePokeInfo.json");
require("dotenv").config();
const bucket = process.env.STORAGE_BUCKET;

function getDetails() {
  const mydata = [];
  allPokemon.forEach((pokemon) => {
    delete pokemon.sprite;
    const appendedId =
      pokemon.id < 10
        ? "00" + pokemon.id
        : pokemon.id < 100
        ? "0" + pokemon.id
        : pokemon.id;
    const url = {
      officalArt: `https://storage.cloud.google.com/${bucket}/png/${appendedId}${pokemon.name.english}.png`,
      sprite: `https://storage.cloud.google.com/${bucket}/sprite/${appendedId}MS.png`,
      sprite2D: `https://storage.cloud.google.com/${bucket}/2dSprite/${pokemon.id}.png`,
      sprite3D: `https://storage.cloud.google.com/${bucket}/3dSprite/${pokemon.name.english.toLowerCase()}.png`,
    };
    mydata.push({ ...pokemon, url });
    // try {
    //   await db.ref("pokemon/" + pokemon.id).set({
    //     ...pokemon,
    //     url,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  });
  return mydata;
}

module.exports = getDetails;
