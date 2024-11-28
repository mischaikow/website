import FormData from 'form-data';
import Mailgun from 'mailgun.js';

import logger from './logger.js';

const mailgun = new Mailgun.default(FormData);
const mg = mailgun.client({
  username: 'api',
  // TODO: fix the below
  key: process.env.MAILGUN_API_KEY || '',
});

export async function sendMail(messageInfo: { destination: string; subject: string; message: string }) {
  logger.debug(`attempting to send ${messageInfo}`);
  mg.messages
    .create('mischaikow.com', {
      from: 'mischaikow.com Postmaster <postmaster@mischaikow.com>',
      to: messageInfo.destination,
      subject: messageInfo.subject,
      text: messageInfo.message,
    })
    .then((msg) => logger.info(msg))
    .catch((err) => logger.error(err));
}
