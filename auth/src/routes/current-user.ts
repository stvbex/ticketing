import express, { Request, Response } from 'express';

import { currentUser } from '@mtrepublic/commontickets';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req: Request, res: Response): any => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter }