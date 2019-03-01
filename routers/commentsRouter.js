const commentsRouter = require('express').Router();
const { updateCommentVote, deleteComment } = require('../controllers/comments');
const { handle405 } = require('../errors/index');

commentsRouter.route('/:comment_id')
  .patch(updateCommentVote)
  .delete(deleteComment)
  .all(handle405);

module.exports = commentsRouter;
