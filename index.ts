import express from "express"
import os from "os";

export const app = express();

app.get("/", (req, res) => {
    res.send("Helo world")
})

app.get("/cpu", (req, res) => {
    for(let i = 0; i < 100000000000; i++ ){
        Math.random()
    }
    res.send("Hellow world");
})

app.get("/host", (req, res) => {
    res.send(os.hostname())
})