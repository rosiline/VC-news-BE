const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routers/apiRouter');
const {
  handleInvalidPath,
  handle400,
  handle404,
  handle422,
  handle500,
} = require('./errors/index');

app.use(bodyParser.json());
app.use('/api', apiRouter);

app.use('/*', handleInvalidPath);

app.use(handle400);
app.use(handle404);
app.use(handle422);
app.use(handle500);

module.exports = app;
