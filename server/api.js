import path from 'path';
import fs from 'fs-extra';
import HttpStatus from 'http-status';
import minimist from 'minimist';
import recursive from 'recursive-readdir';
import flat from 'flat';
import dotprop from 'dotprop';
import { dset } from 'dset';

const argv = minimist(process.argv.slice(2));

const STORE_PATH = path.resolve(process.cwd(), argv.store || 'store');

export async function listFiles(ctx, next) {
    const files = await recursive(STORE_PATH);

    const fileList = files
        .sort((a, b) => a.length - b.length)
        .map((file) => {
            const relative = path.relative(STORE_PATH, file);
            const name = path.parse(file).name;
            return {
                name,
                folder: relative.split(name)[0]
            };
        });

    ctx.status = HttpStatus.OK;
    ctx.body = fileList;
    await next();
}

export async function listKeys(ctx, next) {
    const { id } = ctx.params;

    const file = readFile(id, ctx.query.folder);
    const keys = Object.keys(flat(file)); // flatten object to get all the keys

    ctx.status = HttpStatus.OK;
    ctx.body = keys;
    await next();
}

export async function fetchValue(ctx, next) {
    const { id, key } = ctx.params;

    const file = readFile(id, ctx.query.folder);

    ctx.status = HttpStatus.OK;
    ctx.body = dotprop(file, key);
    await next();
}

export async function updateValue(ctx, next) {
    const { id, key } = ctx.params;
    const { payload, folder } = ctx.request.body;

    const file = readFile(id, folder);

    dset(file, key, payload);

    writeFile(file, id, folder);

    ctx.status = HttpStatus.OK;
    await next();
}

/**
 * Read file from the store.
 *
 * @param {*} name
 * @param {string} [folder='']
 * @returns
 */
function readFile(name, folder = '') {
    const nName = path.normalize(`${folder}${name}`);

    return fs.readJsonSync(path.resolve(STORE_PATH, `${nName}.json`), { encoding: 'utf8' });
}

/**
 * Write file to the store.
 *
 * @param {*} data
 * @param {*} name
 * @param {string} [folder='']
 */
function writeFile(data, name, folder = '') {
    const nName = path.normalize(`${folder}${name}`);
    const filePath = path.resolve(STORE_PATH, `${nName}.json`);

    fs.ensureFileSync(filePath);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
}
