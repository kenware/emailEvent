import express from 'express';
import EmailEventRouter from './emailEvent';

const router = express.Router();

router.use('/emails', EmailEventRouter);

router.get('/health', (req, res) => res.status(200).json('server is up'));
export default router;
