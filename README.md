fatmacho
========

fat mach-o file-format parsers

Legal
-----
This node module has been written by Sergi Àlvarez at Nowsecure and it is distributed under the MIT license.

Usage
-----

The `parse` method accepts a Buffer as argument and returns an array of sub-binaries stored in there.

```js
> var fat = require('fatmacho');
> fat.parse(fs.readFileSync('test.fatbin'));
[
  {
    arch: "arm",
    offset: 4096,
    size: 120656,
    align: 14,
    data: <Buffer ce fa ed fe 0c 00 00 00 09 00 00 00 02 00 00 00 ... > }
  },
  {
    ...
  }
]
```

This is a more elaborated example:

```js
'use strict';

const fs = require('fs');
const macho = require('macho');
const fat = require('fatmacho');
const data = fs.readFileSync(file);
const bins = fat.parse(process.argv[2]);

for (const b of bins) {
  console.log(b.arch, b.offset, '+', b.size);
  console.log(macho.parse (b.data));
}
```
