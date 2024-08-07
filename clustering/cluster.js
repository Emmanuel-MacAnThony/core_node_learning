import cluster from "cluster";
import os from "node:os";

if (cluster.isPrimary) {
  const CORES_COUNT = os.availableParallelism;
  console.log("This is the parent process");
  for (let i = 0; i < CORES_COUNT; i++) {
    const worker = cluster.fork();
    console.log(
      `The parent process spawned a new child process with pid:${worker.process.pid}`
    );
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} ${signal} died. Restarting...`);
    cluster.fork();
  });
} else {
  console.log("This is the child process");
  import("./server.js");
}
