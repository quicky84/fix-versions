#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const modules = path.join(__dirname, '..', '..');
const module_types = path.join(__dirname, '..', '..', '@types');
function loadJSON(path) {
    const content = fs_1.readFileSync(path).toString();
    const json = JSON.parse(content);
    return json;
}
function main() {
    if (!fs_1.existsSync(modules)) {
        console.log(`${modules} does not exist`);
        return;
    }
    const conf_path = path.join(modules, '..', 'package.json');
    if (!fs_1.existsSync(conf_path)) {
        return;
    }
    let conf = loadJSON(conf_path);
    const packages = fs_1.readdirSync(modules)
        .filter(p => (p.indexOf(".") !== 0 && p.indexOf("@") !== 0))
        .map(p => path.join(modules, p, 'package.json'));
    const types = fs_1.readdirSync(module_types)
        .map(t => path.join(module_types, t, 'package.json'));
    const deps = packages.concat(types)
        .filter(d => fs_1.existsSync(d));
    for (const d of deps) {
        const dep = loadJSON(d);
        if (dep.name in conf.dependencies) {
            conf.dependencies[dep.name] = dep.version;
        }
        if (dep.name in conf.devDependencies) {
            conf.devDependencies[dep.name] = dep.version;
        }
    }
    const lock_conf_path = path.join(modules, '..', 'package.json.fixed');
    fs_1.writeFileSync(lock_conf_path, JSON.stringify(conf, null, 4));
}
main();
