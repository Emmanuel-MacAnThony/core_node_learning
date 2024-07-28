import http from "http";
import fs from "fs/promises";

class Butter {
  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.server.on("request", (request, response) => {
      response.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();
        response.setHeader("Content-Type", mime);

        fileStream.pipe(response);
      };

      response.status = (code) => {
        response.statusCode = code;
        return response;
      };

      response.json = (data) => {
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(data));
      };

      if (!this.routes[request.method.toLowerCase() + request.url]) {
        return response
          .status(404)
          .json({ error: `Cannot ${request.method} ${request.url}` });
      }

      this.routes[request.method.toLowerCase() + request.url](
        request,
        response
      );
    });
  }

  listen = (port, callback) => {
    this.server.listen(port, () => {
      callback();
    });
  };

  route(method, path, callback) {
    this.routes[method + path] = callback;
  }
}

export default Butter;
