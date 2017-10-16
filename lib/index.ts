#! /usr/bin/env node

import {readdirSync, readFileSync, writeFileSync, existsSync} from 'fs';
import * as path from 'path';

interface Packages {
    // name : version
    [name: string]: string
}

const modules = path.join(__dirname, '..', '..');
const module_types = path.join(__dirname, '..', '..', '@types');

function loadJSON(path: string): any {
    const content = readFileSync(path).toString();
    const json = JSON.parse(content);

    return json;
}

function main() {
    if (!existsSync(modules)) {
        console.log(`${modules} does not exist`);
        return;
    }

    const conf_path = path.join(modules, '..', 'package.json');
    if (!existsSync(conf_path)) { return; }
    let conf = loadJSON(conf_path);

    const packages = readdirSync(modules)
        .filter(p => (p.indexOf(".") !== 0 && p.indexOf("@") !== 0))
        .map(p => path.join(modules, p, 'package.json'));

    const types = readdirSync(module_types)
        .map(t => path.join(module_types, t, 'package.json'));

    const deps = packages.concat(types)
        .filter(d => existsSync(d));

    for (const d of deps) {
        const dep = loadJSON(d);
        if(dep.name in (conf.dependencies as Object)) {
            conf.dependencies[dep.name] = dep.version;
        }

        if(dep.name in (conf.devDependencies as Object)) {
            conf.devDependencies[dep.name] = dep.version;
        }
    }

    const lock_conf_path = path.join(modules, '..', 'package.json.fixed');
    writeFileSync(lock_conf_path, JSON.stringify(conf, null, 4));
}

main();