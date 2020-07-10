const express = require("express");
const app = express();
const allPokemon = require("./completePokeInfo.json");
const cors = require("cors");
const getDetails = require("./fiyabase/index").getDetails;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const api = require("./routes/api");
const blogs = require("./routes/blogs");
const users = require("./routes/users");
const PORT = process.env.PORT || 5000;

app.use("/api", api);
app.use("/blogs", blogs);
app.use("/users", users);

app.get("/postAll", async (req, res) => {
  const promises = [];
  allPokemon.forEach((pkmn) => {});
});

app.get("/getDetails", async (req, res) => {
  try {
    const data = await getDetails();
    res.status(200).send({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/myImage", (req, res) => {
  getAllImages()
    .then((result) => {
      const [data] = result;
      console.log(data[0]);
      data.forEach((pkmn) => {
        console.log(pkmn.id);
      });
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log("> server started on PORT " + PORT));
