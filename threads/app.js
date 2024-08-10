const { Worker, workerData } = require('worker_threads')

// const THREAD = new Worker("./calc.js", { workerData: "text" })

const CHANNEL = new MessageChannel()


const PORT1 = CHANNEL.port1
const PORT2 = CHANNEL.port2



const THREAD_1 = new Worker("./calc.js", { workerData: { port: PORT1 }, transferList: [PORT1] })
const THREAD_2 = new Worker("./calc.js", { workerData: { port: PORT2 }, transferList: [PORT2] })

// PORT1.postMessage({ name: "Daley Blind" })
// PORT2.on("message", (msg) => {
//     console.log(`Message received on port 2:`, msg)
// })
// PORT1.on("message", (msg) => {
//     console.log(`Message received on port 1:`, msg)
// })
