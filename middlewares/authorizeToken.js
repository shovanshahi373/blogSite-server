const jwt = require("jsonwebtoken");

const authorizeToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];
  if (token === null)
    return res.status(403).json({ msg: "you need to login or register." });
  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ msg: "unauthorized" });
    }
    req.user = decodedToken;
    next();
  });
};

module.exports = { authorizeToken };
