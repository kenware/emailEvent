import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'

import Handler from '../utils/handler';
import logger from '../utils/logger';
import Models from '../models';
import Config from '../config'
import { SNSDataValue, ParamsValue } from '../utils/types'

export default class EmailLead {
  /**
  * @param {object} ctx
  * @param {req} ctx.request
  * @param {res} ctx.response
  */
  static async emailEvent(req: Request, res: Response) {
    try {
      const eventData = req.body['event-data'];
      const { signature, recipient, message } = req.body;
      const emailEvent = new Models.EmailEvent({
        eventId: uuidv4(),
        emailEventId: eventData.id,
        provider: 'Mailgun',
        type: eventData.event,
        emailTimestamp: eventData.timestamp,
        token: signature.token,
        signature: signature.signature,
        recipientEmail: recipient,
        messageSubject: message?.headers?.subject,
        senderEmail: message?.headers?.from
      });

      const reponse = await emailEvent.save();
      logger.info(reponse)
      const sns = new Config.AWS.SNS()

      logger.info(process.env.TOPIC_ARN);

      const SNSData: SNSDataValue = {
        Provider: 'Mailgun',
        timestamp: eventData.timestamp,
        type: eventData.event,
      }

      const params: ParamsValue = {
        Message: JSON.stringify(SNSData),
        TopicArn: process.env.TOPIC_ARN
      }

      await sns.publish(params).promise()
      return Handler.successHandler(req, res, { message: 'Event received and published'}, 200);

    } catch (err) {
      logger.info(err.message);
      return Handler.errorHandler(req, res, err.message, 400);
    }
  }
}
