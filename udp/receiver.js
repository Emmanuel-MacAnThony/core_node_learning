import dgram from "dgram";

const receiver = dgram.createSocket("udp4");
receiver.on("message", (message, remoteInfo) => {
  console.log(
    `Server got : ${message} from ${remoteInfo.address}:${remoteInfo.port}`
  );
  receiver.send(
    "Got it:::",
    remoteInfo.port,
    remoteInfo.address,
    (error, byte) => {
      console.log(byte);
    }
  );
});

receiver.bind({
  address: "127.0.0.1",
  port: 8000,
});

receiver.on("listening", () => {
  console.log(`Server listening ${receiver.address().port}`);
});
