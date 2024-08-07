import { stderr, stdin, stdout, argv, exit } from "node:process";
import fs from "node:fs";

const filePath = argv[2];
if (filePath) {
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(stdout);
  fileStream.on("end", () => {
    exit(0);
  });
}

stdin.pipe(stdout);

// stdin.on("data", (data) => {
//   stdout.write(data.toString("utf8").toUpperCase());
// });
