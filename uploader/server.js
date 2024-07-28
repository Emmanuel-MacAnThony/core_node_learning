import net from "net";
import fs from "fs/promises";

const server = net.createServer(() => {});

server.on("connection", async (socket) => {
  let fileHandle, fileStream;
  console.log("New Connection");

  socket.on("data", async (data) => {
    if (!fileHandle) {
      socket.pause();

      const indexOfDivider = data.indexOf("-------");
      const fileName = data.subarray(10, indexOfDivider).toString("utf-8");

      fileHandle = await fs.open(`storage/${fileName}`, "w");
      fileStream = fileHandle.createWriteStream();
      fileStream.write(data.subarray(indexOfDivider + 7));
      socket.resume();
      fileStream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!fileStream.write(data)) {
        socket.pause();
      }
    }
  });

  socket.on("end", () => {
    console.log("connection ended");
    fileHandle.close();
    fileHandle = undefined;
    fileStream = undefined;
  });
});

server.listen(5050, "127.0.0.1", () => {
  console.log("uploader server opened up on ", server.address());
});
