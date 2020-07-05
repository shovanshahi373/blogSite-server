require("dotenv").config();
const { fStore } = require("../fiyabase/index");
// const { isEmail, isName } = require("../helpers/validators");
const { hashPassword, isHashValid } = require("../helpers/hasher");
const jwt = require("jsonwebtoken");

const usersRef = fStore.collection("/users");

const registerController = (req, res) => {
  console.log("contents of req.body ", req.body);
  const { username: name, email, password } = req.body;
  //check lexically they are valid
  // const errors = {};
  // let [nameError, nameMsg] = isName(name);
  // if (nameError) errors.name = nameMsg;
  // let [emailError, emailMsg] = isEmail(email);
  // if (emailError) errors.mail = emailMsg;
  // if (password !== confirmPassword) errors.password = "passwords did not match";
  // if (Object.keys(errors).length) return res.status(400).json(errors);
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
  //this validation task should be moved to client side
  const { email, password } = req.body;
  // const errors = {};
  // const [emailError, message] = isEmail(email);
  // if (emailError) {
  //   errors.mail = message;
  //   return res.status(400).json({ errors });
  // }
  // console.log("validation passed");
  let user = {};
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
        const token = jwt.sign(
          { name: doc.data().name, uid: doc.id },
          process.env.SECRET
        );
        req.userId = user.userId;
        console.log("authentication verified");
        return res.status(200).json({ token });
      }
    })
    .catch((err) => res.json({ err }));
};

module.exports = { registerController, loginController };
