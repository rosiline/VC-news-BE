const commentsRouter = require('express').Router();
const { updateCommentVote, deleteComment } = require('../controllers/comments');

commentsRouter.route('/:comment_id')
  .patch(updateCommentVote)
  .delete(deleteComment);

module.exports = commentsRouter;
