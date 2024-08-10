const { Worker } = require("worker_threads")
const { performance } = require("perf_hooks")
//Time taken: 5668.8598680000005ms
const start = performance.now()



let result = []
let completed = 0
const THREADS = 2;
const COUNT = 200 // number of prime numbers we want

console.log(`Time taken: ${performance.now() - start}ms`)

for (let i = 0; i < THREADS; i++) {
    const worker = new Worker("./calc.js", {
        workerData: { count: COUNT / THREADS, start: 100_000_000_000_000 + i * 300 }
    })

    const THREAD_ID = worker.threadId
    console.log(`Worker ${THREAD_ID} started successfully`)

    worker.on("message", (primes) => {
        result = result.concat(primes)
    })

    worker.on("error", (error) => {
        console.error("error", error)
    })

    worker.on("exit", (code) => {
        console.log(`Worker ${THREAD_ID} exited.`)
        completed++
        if (completed == THREADS) {
            console.log(`Time Taken: ${performance.now() - start}ms`)
            console.log(result.sort())
        }

        if (code !== 0) {
            console.log(`Worker ${THREAD_ID} exited with code ${code}`)
        }

    })
}