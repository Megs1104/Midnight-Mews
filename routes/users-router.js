const usersRouter = require("express").Router();

const { getUsers } = require("../app/controller");

usersRouter
.route("/")
.get(getUsers)

module.exports = usersRouter;