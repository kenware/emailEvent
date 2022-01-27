import express from 'express';

import EmailController from '../controller/emailEvent';
import EmailMiddleware from '../middleware/validateMailEvent';

const router = express.Router();

router.post('/event',
  EmailMiddleware.validateSignature,
  EmailController.emailEvent);

export default router;
