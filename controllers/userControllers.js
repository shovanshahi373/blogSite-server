require("dotenv").config();
const { fStore } = require("../fiyabase/index");
// const { isEmail, isName } = require("../helpers/validators");
const { hashPassword, isHashValid } = require("../helpers/hasher");
const jwt = require("jsonwebtoken");

const usersRef = fStore.collection("/users");

const registerController = (req, res) => {
  const { username: name, email, password } = req.body;
  usersRef
    .where("email", "==", email)
    .get()
    .then((docs) => {
      if (docs.empty) {
        hashPassword(password)
          .then((hash) => {
            return usersRef.add({
              name,
              email,
              joined: new Date().toISOString(),
              blogs: 0,
              password: hash,
              avatar: "",
              backgroundImage: "",
            });
          })
          .then((doc) => {
            return res.status(201).json({
              msg: `SUCCESS: user created successfully with id ${doc.id}`,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ err });
          });
      } else {
        res.status(400).json({ msg: "ERROR: user already exists" });
        return;
      }
    })
    .catch((err) => res.status(500).json({ err }));
};

const loginController = (req, res) => {
  const { email, password, persistToken } = req.body;
  let user = {};
  let token;
  usersRef
    .where("email", "==", email)
    .get()
    .then((docs) => {
      console.log("do i run");
      if (docs.empty) {
        return res.status(401).json({ error: "unauthorized" });
      }
      docs.forEach((doc) => {
        user = doc.data();
        user.userId = doc.id;
        console.log(user);
      });
      return isHashValid(password, user.password);
      //ishashvalid returns promise so by the time below consolelog runs it is pending
    })
    .then((isValid) => {
      if (!isValid) {
        return res.status(401).json({ error: "unauthorized!" });
      }
      //authorize
      return usersRef.doc(`${user.userId}`).get();
    })
    .then((doc) => {
      if (doc.exists) {
        if (persistToken) {
          token = jwt.sign(
            { name: doc.data().name, uid: doc.id },
            process.env.SECRET
          );
        } else {
          token = jwt.sign(
            {
              data: { name: doc.data().name, uid: doc.id },
              exp: Math.floor(Date.now() / 1000) + 60 * 60,
            },
            process.env.SECRET
          );
        }
        // const token = jwt.sign(
        //   { name: doc.data().name, uid: doc.id },
        //   process.env.SECRET
        // );
        req.userId = user.userId;
        // res.headers["authorization"] = token;
        console.log("authentication verified");
        const finalUserData = {
          name: user.name,
          email: user.email,
          joined: user.joined,
          avatar: user.avatar,
          backgroundImage: user.backgroundImage,
          blogCount: user.blogs,
          userId: user.userId,
        };
        return res.status(200).json({ token, user: finalUserData });
      }
    })
    .catch((err) => res.json({ err }));
};

module.exports = { registerController, loginController };
