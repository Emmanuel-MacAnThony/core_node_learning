// Controllers
const User = require("./controllers/user");

const { performance } = require("perf_hooks");
const { Worker } = require("worker_threads")


module.exports = (server) => {
  // ------------------------------------------------ //
  // ************ USER ROUTES ************* //
  // ------------------------------------------------ //

  // Log a user in and give them a token
  server.route("post", "/api/login", User.logUserIn);

  // Log a user out
  server.route("delete", "/api/logout", User.logUserOut);

  // Send user info
  server.route("get", "/api/user", User.sendUserInfo);

  // Update a user info
  server.route("put", "/api/user", User.updateUser);

  // ------------------------------------------------ //
  // ************ PRIME NUMBER ROUTES ************* //
  // ------------------------------------------------ //

  server.route("get", "/api/primes", (req, res) => {
    const COUNT = Number(req.params.get("count"))
    let STARTING_NUMBER = BigInt(req.params.get("start"))
    const START = performance.now()

    if (STARTING_NUMBER > BigInt(Number.MAX_SAFE_INTEGER)) {
      STARTING_NUMBER = Number(STARTING_NUMBER)
    }

    // const PRIMES = generatedPrimes(COUNT, STARTING_NUMBER, { format: true })

    const worker = new Worker("./lib/calc.js", {
      workerData: {
        COUNT,
        STARTING_NUMBER
      }
    })

    const T = setTimeout(() => {
      worker.terminate()
      res.status(408).json({ message: "Request time out" })
    }, 5000)

    worker.on("message", (primes) => {
      clearTimeout(T)
      res.json({
        primes,
        time: ((performance.now() - START) / 1000).toFixed(2),
      });
    })

  });
};
