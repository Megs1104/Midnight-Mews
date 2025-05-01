const topicsRouter = require("express").Router();

const { getTopics } = require("../app/controller");

topicsRouter
.route("/")
.get(getTopics);

module.exports = topicsRouter;