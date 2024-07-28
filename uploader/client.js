import net from "net";
import fs from "fs/promises";
import path from "path";

const socket = net.createConnection(
  {
    host: "127.0.0.1",
    port: 5050,
  },
  async () => {
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    const fileHandle = await fs.open(filePath, "r");
    const fileStream = fileHandle.createReadStream();

    // for showing the upload progress
    const fileSize = (await fileHandle.stat()).size;
    let uploadedPercentage = 0;
    let bytesUploaded = 0;

    socket.write(`filename: ${fileName}-------`);

    fileStream.on("data", (data) => {
      if (!socket.write(data)) {
        fileStream.pause();
      }

      bytesUploaded += data.length;
      let newPercentage = Math.floor((bytesUploaded / fileSize) * 100);

      if (newPercentage % 5 == 0 && newPercentage != uploadedPercentage) {
        uploadedPercentage = newPercentage;
        console.log(`Uploading...${uploadedPercentage}%`);
      }
    });

    socket.on("drain", () => {
      fileStream.resume();
    });

    fileStream.on("end", () => {
      console.log("file was successfully uploaded");
      socket.end();
    });
  }
);
