import express, { Request, Response } from "express"
import * as os from "os";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Helo world")
})

app.get("/cpu", (req: Request, res: Response) => {
    for (let i = 0; i < 100000000000; i++) {
        Math.random()
    }
    res.send("Hellow world");
})

app.get("/host", (req: Request, res: Response) => {
    res.send(os.hostname())
})

export default app