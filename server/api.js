import path from 'path';
import fs from 'fs-extra';
import HttpStatus from 'http-status';
import minimist from 'minimist';
import recursive from 'recursive-readdir';

const argv = minimist(process.argv.slice(2));

const STORE_PATH = path.resolve(process.cwd(), argv.store || 'store');

console.log(argv, STORE_PATH);

export async function listFiles(ctx, next) {
    const files = await recursive(STORE_PATH);

    const fileList = files.map((file) => {
        const relative = path.relative(STORE_PATH, file);
        const name = path.parse(file).name;
        return {
            name,
            folder: relative.split(name)[0]
        };
    });

    // console.log(fileList);
    /* 
    // console.log(files);

    const issueList = fs.readdirSync(STORE_PATH).map((file) => {
        // console.log(path.parse(file));

        return path.parse(file).name;
    }); */

    ctx.status = HttpStatus.OK;
    ctx.body = fileList;
    await next();
}

export async function listKeys(ctx, next) {
    console.log('1', ctx.params, ctx.request.body);

    const { id } = ctx.params;

    console.log(id, `${id}.json`, path.normalize(id));

    const issue = fs.readJsonSync(path.resolve(STORE_PATH, ...id.split('/'), '.json'), { encoding: 'utf8' });
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
