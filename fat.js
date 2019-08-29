'use strict';

const fat = exports;

const CAFEBABE = 3405691582;

const cpuType = {
  0x00000003: 'i386',
  0x80000003: 'x86_64',
  0x00000009: 'arm',
  0x80000009: 'arm64',
  0x00000000: 'arm64',
  0x0000000a: 'ppc_32',
  0x8000000a: 'ppc_64'
};

fat.parse = function (data, cb) {
  const u32 = function (x) {
    return data.readUInt32BE(x);
  };
  const magic = u32(0);
  if (magic !== CAFEBABE) {
    throw new Error('invalid file format');
  }
  const eof = data.length;
  const ncmds = u32(4);
  var slices = [];
  for (var cmd = 0, off = 12; cmd < ncmds; off += 20, cmd++) {
    const cpu = u32(off);
    const from = u32(off + 4);
    const size = u32(off + 8);
    if (from === 0 || size === 0) {
      console.error('fat.parse: skip null entry', cmd);
      continue;
    }
    if (from + size > eof || off > eof) {
      console.error('fat.parse: skip out of range entry', cmd);
      continue;
    }
    slices.push({
      arch: cpuType[cpu] || cpu,
      offset: from,
      size: size,
      align: u32(off + 12),
      data: data.slice(from, from + size)
    });
  }
  return slices;
};
