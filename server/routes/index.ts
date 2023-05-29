import express, { NextFunction, Request, Response, Router } from 'express';
const router: Router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction): Response {
  return res.send('Odin Book Api')
});

export default router
