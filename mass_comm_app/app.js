import { spawn } from "node:child_process";
import fs from "node:fs";

const numberFormatter = spawn("number_formatter", ["./dest.txt", "$", ","]);

numberFormatter.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

numberFormatter.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});

numberFormatter.on("close", (code) => {
  if (code === 0) {
    console.log("The file was read, processed and written successfully");
  } else {
    console.log("Something bad happened");
  }
});

const fileStream = fs.createReadStream("./src.txt");
fileStream.pipe(numberFormatter.stdin);
