import http from "http";

const agent = new http.Agent({ keepAlive: true });

const request = http.request({
  agent,
  hostname: "localhost",
  port: 8050,
  method: "POST",
  path: "/create-post",

  headers: {
    "Content-Type": "application/json",
    name: "Joe",
  },
});

request.on("response", (response) => {
  console.log(response.headers);

  response.on("data", (data) => {
    console.log(JSON.parse(data));
  });

  response.on("end", () => {
    console.log("No more data");
  });
});

request.end(
  JSON.stringify({
    title: "The Title",
    body: "Some Text",
  })
);
