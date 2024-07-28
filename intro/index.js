const EventEmitter = require("./events");

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

myEmitter.on("foo", () => {
  console.log("An event occured");
});

myEmitter.on("foo", () => {
  console.log("An event occured 2");
});

myEmitter.emit("foo");
