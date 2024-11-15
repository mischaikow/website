import app from './app.js';
import logger from './logger.js';

const server = app.listen(app.get('port'), () => {
  logger.info(`  App is running at http://localhost:${app.get('port')}\n`);
  logger.info('  Press CTRL-C to stop\n');
});

export default server;
