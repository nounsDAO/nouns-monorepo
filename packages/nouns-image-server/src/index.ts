import {getImages} from "./io";
import {Response, Request} from "express";
import * as fs from "fs";
const express = require('express')

export const config = {
    baseDir: process.env.BASE_DIR ?? "./images",
   port: process.env.PORT ?? 3020
}

const app = express()

app.get('/', (req: Request, res: Response) => {
    res.send(getImages())
})
app.get('/:filename*', (req: Request, res: Response) => {
    // Perform _some_ safeguarding from directory traversal
    const safeFilePath = ['.', req.path.replace(/(\.\.|~)/g, '')].join('/')
    res.send(fs.readFileSync(safeFilePath))
})

app.listen(config.port, () => {
    console.log(`Nouns image server listening at http://localhost:${config.port}`)
})
