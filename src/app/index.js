const Koa = require('koa');
const bodyParse = require('koa-bodyparser');

const errHandle = require('./err-handle');
const useRoutes = require('../router');

const app = new Koa();

app.useRoutes = useRoutes;

app.use(bodyParse());
app.useRoutes(); 
app.on('error', errHandle);

module.exports = app; 
