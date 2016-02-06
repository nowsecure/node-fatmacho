'use strict';
var fat = exports;

const CAFEBABE = 3405691582;

const cpuType = {
	0x00000003: 'i386',
	0x80000003: 'x86_64',
	0x0000000a: 'ppc_32',
	0x8000000a: 'ppc_64',
	0x00000009: 'arm',
	0x00000000: 'arm64',
	0x80000009: 'arm64',
}

fat.parse = function(data) {
	const magic = data.readUInt32BE (0);
	if (magic !== CAFEBABE) {
		throw 'invalid file format'
	}
	var slices = [];
	var ncmds = data.readUInt32BE (4);
	for (var off = 0xc; ncmds-- > 0; off += 20) {
		var cpu = data.readUInt32BE(off);
		var from = data.readUInt32BE(off+4);
		var size = data.readUInt32BE(off+8);
		if (from === 0 || size === 0) {
			continue;
		}
		if (from + size > data.length) {
			console.log("fat.parse: sub-bin out of range");
			continue;
		}
		slices.push({
			arch: cpuType[cpu] || cpu,
			offset: from,
			size: size,
			align: data.readUInt32BE(off+12),
			data: data.slice (from, from + size)
		});
	}
	return slices;
}
