import Butter from "./butter.js";

const server = new Butter();

server.listen(8000, () => {
  console.log("Server started on port 8000");
});

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "./script.js", (req, res) => {
  res.sendFile("./public/script.js", "text/javascript");
});

server.route("post", "/login", (req, res) => {
  res.status(400).json({ message: "Bad login info" });
});
