const jwt = require("jsonwebtoken");

const authorizeToken = (req, res, next) => {
  console.log("the mwthoda are: ", req.method);
  // if (req.method === "OPTIONS") {
  //   res.send(200);
  // }
  const auth = req.headers["authorization"];
  console.log("the token is", auth);
  const token = auth && auth.split(" ")[1];
  if (token === null)
    return res.status(403).json({ msg: "you need to login or register." });
  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    if (err) {
      if (err.message === "jwt expired") {
        return res.status(408).json({ msg: "session has expired" });
      }
      console.log("the err is coming from here", err);
      return res.status(401).json({ msg: "unauthorized" });
    }
    console.log("decoded token is:", decodedToken);
    //for fixing the possible error when the user
    //in client wants to 'remember me' and "don't remember me" otherwise
    if (decodedToken.data) {
      req.user = decodedToken;
    } else {
      req.user = {
        data: decodedToken,
      };
    }
    // res.headers["Access-Control-Allow-Credentials"];
    // req.user = decodedToken;
    next();
  });
};

module.exports = { authorizeToken };
