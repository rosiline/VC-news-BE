const commentsRouter = require('express').Router();
const { updateCommentVote } = require('../controllers/comments');

commentsRouter.route('/:comment_id')
  .patch(updateCommentVote);

module.exports = commentsRouter;
