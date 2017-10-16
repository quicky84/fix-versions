It's often required to fix versions of the packages against which a piece of software is developed.
This small utility allows to do it for `Node.js` projects.
The utility generates a `package.json.fixed` file containing current versions of the employed packages.

## Usage

install locally
```
npm install -D https://github.com/quicky84/fix-versions
```

run
```
./node_modules/.bin/fix-versions
```

this will produce a file `package.json.fixed` next to the original `package.json`