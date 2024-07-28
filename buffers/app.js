const { Buffer } = require("buffer");

const MEMORY_CONTAINER = Buffer.alloc(4);

MEMORY_CONTAINER[0] = 0xf4;
MEMORY_CONTAINER[1] = 0x34;
MEMORY_CONTAINER[2] = 0xb6;
MEMORY_CONTAINER[3] = 0xff;

console.log(MEMORY_CONTAINER[0]);
console.log(MEMORY_CONTAINER);
