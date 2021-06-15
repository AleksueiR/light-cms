import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import Logger from 'koa-logger';
import mount from 'koa-mount';
import Cors from 'koa-cors';
import serveStatic from 'koa-static';
import path from 'path';
import * as api from './api.js';

const port = 9000;

const app = new Koa();
const client = new Koa();

client.use(serveStatic(path.resolve(process.cwd(), 'build')));
app.use(mount('/', client));

const router = new Router();

router.get('/api/files', api.listFiles);
router.get('/api/files/:id+', api.listKeys);
router.get('/api/files/:id/:key', api.fetchValue);
router.put('/api/files/:id/:key', api.updateValue);

app.use(Cors());
app.use(Logger());
app.use(BodyParser());
app.use(router.routes()); //.use(router.allowedMethods());

app.listen(port, () => console.log(`Go to: http://localhost:${port}`));
