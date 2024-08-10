const { Worker, workerData } = require('worker_threads')


const PORT = workerData.port

PORT.on("message", (msg) => {
    console.log(`Worker Received:`, msg)
})

PORT.postMessage("Some Text For Testing")