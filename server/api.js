import path from 'path';
import fs from 'fs-extra';
import HttpStatus from 'http-status';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const STORE_PATH = path.resolve(process.cwd(), argv.store || 'store');

console.log(argv, STORE_PATH);

export async function listIssues(ctx, next) {
    const issueList = fs.readdirSync(STORE_PATH).map((file) => path.parse(file).name);

    ctx.status = HttpStatus.OK;
    ctx.body = issueList;
    await next();
}

export async function listKeys(ctx, next) {
    const { id } = ctx.params;

    const issue = fs.readJsonSync(path.resolve(STORE_PATH, `${id}.json`), { encoding: 'utf8' });
    const keys = Object.keys(issue);

    ctx.status = HttpStatus.OK;
    ctx.body = keys;
    await next();
}

export async function fetchValue(ctx, next) {
    const { id, key } = ctx.params;

    const issue = fs.readJsonSync(path.resolve(STORE_PATH, `${id}.json`), { encoding: 'utf8' });

    ctx.status = HttpStatus.OK;
    ctx.body = issue[key];
    await next();
}

export async function updateValue(ctx, next) {
    const { id, key } = ctx.params;

    const filePath = path.resolve(STORE_PATH, `${id}.json`);
    const issue = fs.readJsonSync(filePath, { encoding: 'utf8' });

    const { payload } = ctx.request.body;
    console.log(payload);

    issue[key] = payload;

    fs.ensureFileSync(filePath);
    fs.writeFileSync(filePath, JSON.stringify(issue, null, 4), 'utf-8');

    ctx.status = HttpStatus.OK;
    await next();
}
