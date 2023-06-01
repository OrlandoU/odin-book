import express, { NextFunction, Request, Response, Router } from "express"
import fs from 'fs'

const router: Router = express.Router()

router.get('/uploads/:directory/:name', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const path = `./dist/uploads/${req.params.directory}/${req.params.name}`

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err)
            if (err.errno) {
                return res.status(500).send('Error reading image file');
            }
            console.error(err);
            return res.status(500).send('Error reading image file');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            return res.end(data);
        }
    })
})

export default router