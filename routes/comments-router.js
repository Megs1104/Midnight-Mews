const commentsRouter = require("express").Router();

const { getComments, deleteComment } = require("../app/controller");

commentsRouter
.route("/")
.get(getComments);


commentsRouter
.route("/:comment_id")
.delete(deleteComment);

module.exports = commentsRouter;