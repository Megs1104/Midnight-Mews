const commentsRouter = require("express").Router();

const { getComments, deleteComment, patchCommentVotes } = require("../app/controller");

commentsRouter
.route("/")
.get(getComments);


commentsRouter
.route("/:comment_id")
.delete(deleteComment)
.patch(patchCommentVotes);

module.exports = commentsRouter;