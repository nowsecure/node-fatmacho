'use strict';

const fs = require('fs');
const macho = require('macho');
const fat = require('./fat');

// const file = 'fatmach0-3true';
const file = process.argv[2];
if (file === undefined) {
	console.log('Usage: node index.js [path-to-fat-macho]');
	process.exit (1);
}

var data = fs.readFileSync(file);
try {
	/* try to parse macho binary */
	var exec = macho.parse(data);
	console.log(exec);
} catch (e) {
	/* try to parse fat-macho binary */
	var bins = fat.parse(data);
	for (var b of bins) {
		console.log(b);
		console.log(fat.cpuType[b.arch]);
		try {
			var exec = macho.parse(b.data);
			console.log(exec);
		} catch (e) {
			console.error (e);
		}
	}
}
