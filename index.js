'use strict';

const fs = require('fs');
const macho = require('macho');
const fat = require('./fat');

const file = process.argv[2];
if (file === undefined) {
  console.log('Usage: node index.js [path-to-fat-macho]');
  process.exit(1);
}

const data = fs.readFileSync(file);
try {
  /* try to parse macho binary */
  console.log(macho.parse(data));
} catch (e) {
  /* try to parse fat-macho binary */
  const bins = fat.parse(data);
  for (var b of bins) {
    console.log(b);
    try {
      console.log(macho.parse(b.data));
    } catch (e) {
      console.error(e);
    }
  }
}
