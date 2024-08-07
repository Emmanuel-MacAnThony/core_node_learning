import cpeak from "cpeak";

const server = new cpeak();

server.route("get", "/", (req, res) => {
  res.json({ message: "This is some message" });
});

server.route("get", "/heavy", (req, res) => {
  for (let i = 0; i < 10000000; i++) {}

  res.json({ message: "The heavy operation is now done" });
});

const PORT = 5090;
server.listen(5090, () => {
  console.log(`Server has started on port ${PORT}`);
});
