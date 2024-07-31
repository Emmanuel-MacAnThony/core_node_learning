import Butter from "./butter.js";

const PORT = 8000;
const USERS = [
  {
    id: 1,
    name: "Liam Brown",
    username: "Liam23",
    password: "password",
  },
  {
    id: 2,
    name: "Mary Brown",
    username: "Mary23",
    password: "password",
  },
  {
    id: 1,
    name: "Adams Brown",
    username: "Adams23",
    password: "password",
  },
];
const POSTS = [
  {
    id: 1,
    title: "This is a post",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    userId: 1,
  },
];

const SESSIONS = [

]

const server = new Butter();

/** File Routes */
server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/login", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

/** JSON Routes */
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id == post.userId);
    post.author = user.name;
    return post;
  });
  res.status(200).json(posts);
});

server.route("get", "/api/user", (req, res) => {
  const token = req.headers.cookie.split("=")[1]
  const session = SESSIONS.find(session => session.token = token)
  if (session){
      console.log("session", session)
  }else{
    res.status(401).send({ error: "Unauthorized"});
  }
  console.log(token)
});

server.route("post", "/api/login", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString("utf-8");
  });

  req.on("end", () => {
    body = JSON.parse(body);

    const username = body.username;
    const password = body.password;

    const user = USERS.find((user) => user.username === username);
    if (user && user.password === password) {
      const token = Math.floor(Math.random() * 10000000000).toString()
      SESSIONS.push({
        userId: user.id,
        token
      })
      res.setHeader("Set-Cookie", `token=${token}; Path=/;`)
      res.status(200).json({ message: "Logged in successfully" });
    } else {
      res.status(401).send({ error: "Invalid username or password" });
    }
  });
});
 
server.listen(PORT, () => {
  console.log("server listening on port 8000");
});

// npm install --save-exact webpack@5.88.2 webpack-cli@4.3.0
