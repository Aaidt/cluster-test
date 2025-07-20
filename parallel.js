import cluster from "cluster";
import os from "os";

const total_cpus = os.cpus().length;
const count = 1_000_000_000_0;
const chunkSize = Math.floor(count / total_cpus);
let ans = 0

if (cluster.isPrimary) {
    let total = 0;
    let completed = 0;
    const startTime = Date.now()

    for (let i = 0; i < total_cpus; i++) {
        const worker = cluster.fork();
        const start = i * chunkSize;
        const end = i === total_cpus - 1 ? count : (i + 1) * chunkSize - 1;

        worker.send({ start, end });

        worker.on('message', (msg) => {
            if(msg.partialSum !== undefined){
                total += msg.partialSum
                completed++
                if(completed == total_cpus){
                    const endTime = Date.now()
                    console.log('Total sum: ' + total);
                    console.log(`Total time: ${endTime - startTime}`);
                    process.exit()
                }
            }
        });

    }
} else {
    process.on('message', (msg) => {
        const { start, end } = msg
        let localSum = 0;
        const t0 = Date.now();

        for (let n = start; n < end; n ++){
            localSum += n
        }
        const t1 = Date.now()
        process.send({ partialSum: localSum });
        console.log(`Worker ${process.pid} completed in ${(t1 - t0) / 1000} seconds`)
    })
}   
