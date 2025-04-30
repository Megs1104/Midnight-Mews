require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`
});

const ENV = process.env.NODE_ENV || "development";
const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');


const runSeed = () => {
  return seed(devData)
  .then(() => db.end());
};

runSeed();
