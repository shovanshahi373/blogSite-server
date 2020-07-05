const router = require("express").Router();
const allPokemon = require("../completePokeInfo.json");
const { firebase, fStore } = require("../fiyabase/index");

router.get("/pokemon", (req, res) => {
  const pokeArr = [];
  fStore
    .collection("pokemon")
    .get()
    .then((snapshots) => {
      snapshots.forEach((doc) => {
        pokeArr.push(doc.data());
        console.log(doc.data().name.english);
      });
      res.status(200).json({ data: pokeArr });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
  // let filteredList = [...allPokemon];
  // const { id = "", type = "", region = "", limit = "", page = "0" } = req.query;

  // if (id) {
  //   const pokemon = allPokemon.find((pkmn) => pkmn.id === +id);
  //   return res.status(200).json({ data: pokemon });
  // }
  // if (region) {
  //   const r = region.toLowerCase();
  //   filteredList =
  //     r === "kanto"
  //       ? allPokemon.slice(0, 151)
  //       : r === "johto"
  //       ? allPokemon.slice(152, 252)
  //       : r === "hoenn"
  //       ? allPokemon.slice(253, 385)
  //       : r === "sinnoh"
  //       ? allPokemon.slice(386, 492)
  //       : r === "unova"
  //       ? allPokemon.slice(493, 648)
  //       : r === "kalos"
  //       ? allPokemon.slice(649, 721)
  //       : r === "alola"
  //       ? allPokemon.slice(722, 808)
  //       : r === "galar"
  //       ? allPokemon.slice(809, 889)
  //       : allPokemon;
  // }
  // if (type) {
  //   filteredList = filteredList.filter((pkmn) => {
  //     return pkmn.type.some((t) => t.toLowerCase() === type.toLowerCase());
  //   });
  // }

  // if (limit && !isNaN(limit)) {
  //   const maxPages = Math.floor(filteredList.length / limit);
  //   if (page < 0) {
  //     page = 0;
  //   }
  //   if (page > maxPages) {
  //     page = maxPages;
  //   }
  //   // console.log(+page * +limit, +limit);
  //   const newArr = filteredList.slice(+page * +limit, +page * +limit + +limit);
  //   prevPage =
  //     +page === 0
  //       ? null
  //       : `http://localhost:5000/api/pokemon?region=${region}&type=${type}&limit=${limit}&page=${
  //           page - 1
  //         }`;
  //   nextPage =
  //     +page === maxPages
  //       ? null
  //       : `http://localhost:5000/api/pokemon?region=${region}&type=${type}&limit=${limit}&page=${
  //           +page + 1
  //         }`;
  //   return res.status(200).json({ data: newArr, prevPage, nextPage });
  // }
  // return res.status(200).json({ data: filteredList });
});

router.get("/pokemon/id/:id", async (req, res) => {
  const { id } = req.params;
  const pokemonRef = fStore.collection("pokemon");
  try {
    const query = await pokemonRef.where("id", "==", +id).get();
    const snapshot = query.docs[0];
    console.log(snapshot.data());
    res.status(200).json({ data: [{ ...snapshot.data() }] });
  } catch (error) {
    console.log(error);
  }
});

router.get("/pokemon/region/:region", async (req, res) => {
  const { region } = req.params;
  const fdata = [];
  const pokemonRef = fStore.collection("pokemon");
  let query;
  try {
    switch (region.toLowerCase()) {
      case "kanto":
        query = await pokemonRef
          .where("id", ">=", 1)
          .where("id", "<=", 152)
          .get();
        query.docs.forEach((doc) => {
          fdata.push(doc.data());
        });
        return res.status(200).json({ fdata });
      case "johto":
        query = await pokemonRef
          .where("id", ">=", 153)
          .where("id", "<=", 251)
          .get();
        query.docs.forEach((doc) => {
          fdata.push(doc.data());
        });
        return res.status(200).json({ fdata });
      case "hoenn":
        query = await pokemonRef
          .where("id", ">=", 252)
          .where("id", "<=", 386)
          .get();
        query.docs.forEach((doc) => {
          fdata.push(doc.data());
        });
        return res.status(200).json({ fdata });
      case "sinnoh":
        query = await pokemonRef
          .where("id", ">=", 387)
          .where("id", "<=", 493)
          .get();
        query.docs.forEach((doc) => {
          fdata.push(doc.data());
        });
        return res.status(200).json({ fdata });
      case "unova":
        query = await pokemonRef
          .where("id", ">=", 494)
          .where("id", "<=", 649)
          .get();
        query.docs.forEach((doc) => {
          fdata.push(doc.data());
        });
        return res.status(200).json({ fdata });
      case "kalos":
        query = await pokemonRef
          .where("id", ">=", 650)
          .where("id", "<=", 721)
          .get();
        query.docs.forEach((doc) => {
          fdata.push(doc.data());
        });
        return res.status(200).json({ fdata });
      case "alola":
        query = await pokemonRef
          .where("id", ">=", 722)
          .where("id", "<=", 809)
          .get();
        query.docs.forEach((doc) => {
          fdata.push(doc.data());
        });
        return res.status(200).json({ fdata });
      case "galar":
        query = await pokemonRef
          .where("id", ">=", 810)
          .where("id", "<=", 890)
          .get();
        query.docs.forEach((doc) => {
          fdata.push(doc.data());
        });
        return res.status(200).json({ fdata });
      default:
        return res.status(404).json({ error: "unknown region" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.get("/pokemon/type/:type", async (req, res) => {
  const { type } = req.params;
  const fdata = [];
  try {
    const pokeRef = fStore.collection("pokemon").orderBy("id");
    const query = await pokeRef.where("type", "array-contains", type).get();
    query.docs.forEach((doc) => {
      fdata.push(doc.data());
    });
    return res.status(200).json({ fdata });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
