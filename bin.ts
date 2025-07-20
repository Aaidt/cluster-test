import cluster from "cluster";
import * as os from "os";
import app from "./index"

const CPU_COUNT = os.cpus().length

if(cluster.isPrimary){
    console.log("No. of CPUS is: " + CPU_COUNT)
    console.log(`Primary ${process.pid} is running`)

    // fork workers
    for(let i = 0; i < CPU_COUNT; i++){
        cluster.fork()
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died.`)
        console.log('Lets fork another worker')
        cluster.fork()
    })
}else{ 
    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started.`)
    })
}
