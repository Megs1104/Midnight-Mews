
const apiRouter = require("express").Router()

const { getApi } = require("../app/controller");

const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router");
const commentsRouter = require("./comments-router");
const articlesRouter = require("./articles-router");

apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);



apiRouter
.route("/")
.get(getApi)


module.exports = apiRouter;