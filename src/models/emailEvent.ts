const Joi = require('joi');
import Config from '../config';

const EmailEvent = Config.DB.define(process.env.EMAIL_EVENT_TABLE_NAME, {
  hashKey: 'eventId',
  timestamps: true,
  schema: {
    type: Joi.string(),
    eventId: Joi.string(),
    emailTimestamp: Joi.number(),
    provider: Joi.string(),
    token: Joi.string(),
    signature: Joi.string(),
    recipientEmail: Joi.string(),
    messageSubject: Joi.string(),
    senderEmail: Joi.string(),
  }
});

EmailEvent.config({tableName: process.env.EMAIL_EVENT_TABLE_NAME});

export default EmailEvent;