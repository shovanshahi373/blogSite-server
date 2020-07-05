const bcrypt = require("bcrypt");

const hashPassword = (password, rounds = 10) => {
  return bcrypt.hash(password, rounds);
};

const isHashValid = (password,hash) => {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword,isHashValid };