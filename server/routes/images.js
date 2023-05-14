const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/:directory/:name', async (req, res, next) => {
    const path = `./${req.params.directory}/${req.params.name}`
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading image file');
        } else {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(data);
        }
    })
})

module.exports = router