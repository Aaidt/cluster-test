import * as os from "os";
import cluster from "cluster";

const count = 1_000_000_000;
const total_cpus = os.cpus().length;
const chunkSize = Math.floor(count / total_cpus);

if (cluster.isPrimary) {
    console.log(`Master process started: ${process.pid}`);
    const startTime = Date.now();

    let ans = 0;
    let completed = 0;

    for (let i = 0; i < total_cpus; i++) {
        const worker = cluster.fork();
        console.log(`Worker ${worker.process.pid} started.`);

        const start = i * chunkSize;
        const end = i === total_cpus - 1 ? count : (i + 1) * chunkSize;

        worker.send({ start, end });

        worker.on("message", (msg) => {
            ans += msg.partialSum;
            completed++;

            if (completed === total_cpus) {
                const endTime = Date.now();
                console.log(`Total sum: ${ans}`);
                console.log(`Total time taken: ${endTime - startTime} ms`);
                process.exit();
            }
        });
    }
} else {
    process.on("message", (msg: { start: number; end: number }) => {
        const { start, end } = msg;
        let localSum = 0;

        for (let n = start; n < end; n++) {
            localSum += n;
        }

        if (process.send) process.send({ partialSum: localSum });
    });
}
