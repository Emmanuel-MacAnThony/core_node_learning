import net from "net";

const server = net.createServer();

const clients = [];

server.listen(3008, "127.0.0.1", () => {
  console.log("server opened up on", server.address());
});

server.on("connection", (socket) => {
  console.log(" A new connection to the server");

  const clientId = clients.length + 1;

  clients.map((client) => {
    client.socket.write(`User ${clientId} joined`);
  });

  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    clients.map((client) => {
      console.log("data:::", data.toString("utf-8"));
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  socket.on("end", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} left`);
    });
  });

  socket.on("error", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });

  clients.push({ id: clientId.toString(), socket });
});
