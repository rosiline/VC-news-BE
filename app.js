const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routers/apiRouter');

app.use(bodyParser.json());
app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Invalid url' });
});

app.use((err, req, res, next) => {
  if (err.status === 400) res.status(400).send({ msg: 'Bad request' });
  else console.log(err);
});

module.exports = app;
