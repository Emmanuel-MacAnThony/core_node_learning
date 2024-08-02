import { promises as fs, createReadStream, createWriteStream } from "fs";
import { gzip, createGzip } from "zlib";
import { promisify } from "util";

const gzipPromise = promisify(gzip);

const filename = process.argv[2];

async function main() {
  const data = await fs.readFile(filename);
  const gzippedData = await gzipPromise(data);
  await fs.writeFile(`${filename}.gz`, gzippedData);
  console.log("File successfully compressed");
}

async function mainv2() {
  const filename = process.argv[2];
  createReadStream(filename)
    .pipe(createGzip())
    .pipe(createWriteStream(`${filename}.gz`))
    .on("finish", () => console.log("File successfully compressed"));
}

main();
