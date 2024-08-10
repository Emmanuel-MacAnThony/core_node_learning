const generatedPrimes = require("./prime-generator")
const { parentPort, workerData } = require("worker_threads")

const PRIMES = generatedPrimes(workerData.COUNT, workerData.STARTING_NUMBER, { format: true })

parentPort.postMessage(PRIMES)