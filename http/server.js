import http from "http";

const server = http.createServer();

server.listen(8050, () => {
  console.log("server listening on http://localhost:8050");
});

server.on("request", (request, response) => {
  console.log(request.method);
  console.log(request.headers);
  const name = request.headers.name;
  console.log(request.url);

  let data = "";
  request.on("data", (chunk) => {
    data = chunk.toString("utf-8");
  });

  request.on("end", () => {
    data = JSON.parse(data);
    console.log(data);
    console.log(name);

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        message: `Post with the title ${data.title} was created by ${name}`,
      })
    );
  });
});
