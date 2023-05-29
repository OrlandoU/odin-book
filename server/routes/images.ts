import express, { NextFunction, Request, Response, Router } from "express"
import fs from 'fs'

const router: Router = express.Router()

router.get('/:directory/:name', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const path = `./${req.params.directory}/${req.params.name}`
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading image file');
        } else {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            return res.end(data);
        }
    })
})

export default router