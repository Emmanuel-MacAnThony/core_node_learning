const fs = require("fs/promises");
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("test.txt", "w");
  const stream = fileHandle.createWriteStream();

  let i = 0;
  const numberOfWrites = 100000;
  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from(`${i}\n`, "utf-8");
      if (i === numberOfWrites - 1) {
        return stream.end(buff);
      }
      if (!stream.write(buff)) {
        break;
      }
      i++;
    }
  };

  writeMany();

  stream.on("drain", () => {
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandle.close();
  });

  //   console.log(stream.writableHighWaterMark);
  //   const buffer = Buffer.alloc(16383, 10);
  //   console.log(stream.write(buffer));
  //   console.log(stream.write(Buffer.alloc(1, "a")));
  //   console.log(stream.writableLength);

  //   stream.on("drain", () => {
  //     console.log("we are now safe to write more data");
  //   });

  //   fileHandle.close();
})();

// const fs = require("fs");

// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.open("test.txt", "w", (err, fd) => {
//     for (i = 0; i < 1000000; i++) {
//       const buff = Buffer.from(`${i}`, "utf-8");
//       fs.writeSync(fd, buff);
//     }
//   });
//   console.timeEnd("writeMany");
// })();
