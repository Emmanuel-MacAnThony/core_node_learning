import net from "net";
import readline from "readline/promises";

let id;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const client = net.createConnection(
  {
    host: "127.0.0.1",
    port: 3008,
  },
  async () => {
    console.log("Connected to the server");

    const ask = async () => {
      const message = await rl.question("Enter a message > ");
      await moveCursor(0, -1);
      await clearLine(0);
      client.write(`${id}-message-${message}`);
    };

    ask();

    client.on("data", async (data) => {
      await moveCursor(0, -1);
      await clearLine(0);
      if (data.toString("utf-8").startsWith("id")) {
        id = data.toString("utf-8").substring(3);
        console.log(`your id is ${id} \n`);
      } else {
        console.log("data:::", data.toString("utf-8"));
      }

      ask();
    });
  }
);

client.on("close", () => {
  console.log("connection closed");
});
