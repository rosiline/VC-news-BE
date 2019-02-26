const app = require('express')();
const apiRouter = require('./routers/apiRouter');

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Invalid url' });
});

module.exports = app;
