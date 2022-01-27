import { Request, Response } from 'express';
import crypto from 'crypto';
import Validator from 'validatorjs';

import Handler from '../utils/handler';
import logger from '../utils/logger';
import { RuleValue } from '../utils/types';

export default class MailgunEvent {
  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   * @param {Function} next
   */
  static async validateSignature(req: Request, res: Response, next) {
    const rules = {
      token: 'required|string',
      signature: 'required|string',
      timestamp: 'required|string',
      event: 'required|string',
      id: 'required|string',
    };

    const error = 'This event may not come from mailgun';

    try{
      logger.info(req.body)
      const eventData: any = req.body['event-data'] || {}
      const { signature } = req.body;
      const validation: any = new Validator({...eventData, ...signature}, rules);
      if (validation.fails()) {
        return Handler.errorHandler(req, res, validation.errors.errors, 400);
      }
      const encodedToken: string = crypto
        .createHmac('sha256', process.env.MAILGUN_WEBHOOK_SIGNIN_KEY)
        .update(signature?.timestamp.concat(signature.token))
        .digest('hex')

      if(encodedToken !== signature.signature){
        return Handler.errorHandler(req, res, error, 400);
      }
      return next();
    }catch(err) {
      logger.info(err)
      return Handler.errorHandler(req, res, err.message || error, 400);
    }
  }
  
}
