const app = require('express')();
const apiRouter = require('./routers/apiRouter');

app.use('/api', apiRouter);

module.exports = app;
