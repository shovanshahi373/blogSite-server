// require("dotenv").config();
// const jwt = require("jsonwebtoken");
const { isEmail } = require("../helpers/validators");
const { isHashValid } = require("../helpers/hasher");

const authenticate = (usersRef) => {
  return (req, res, next) => {
    //this validation task should be moved to client side
    const { email, password } = req.body;
    const errors = {};
    const [emailError, message] = isEmail(email);
    if (emailError) {
      errors.mail = message;
      return res.status(400).json({ errors });
    }
    console.log("validation passed");
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
        // return usersRef.doc(`${user.userId}`).get();
      })
      .catch((err) => res.status(500).json({ err }));
    // .then((doc) => {
    //   if (doc.exists) {
    //     const token = jwt.sign(
    //       { name: doc.data().name, uid: doc.id },
    //       process.env.SECRET
    //     );
    //     req.userId = user.userId;
    //     console.log("authentication verified");
    //     return res.status(200).json({ token });
    //   }
    // })
    // .catch((err) => res.json({ err }));
    next();
  };
};

const authorizeGateway = () => {
  //logic to check if the user token is valid
};

module.exports = { authenticate };
