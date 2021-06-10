import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static-server';
import path from 'path';
import fs from 'fs-extra';
import HttpStatus from 'http-status';

const port = 9000;
const app = new Koa();

app.use(
    serve({
        rootDir: path.resolve(__dirname, '..', 'build'),
        rootPath: '/'
    })
);

const router = new Router();

router.get('/book', async (ctx, next) => {
    const STORE_PATH = path.resolve(__dirname, 'public');
    const issueList = fs.readdirSync(STORE_PATH).map((file) => path.parse(file).name);

    ctx.status = HttpStatus.OK;
    ctx.body = issueList;
    await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => console.log(`Go to: http://localhost:${port}`));
