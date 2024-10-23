import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRouter from './router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../static')));

app.set('port', 3000);

nunjucks.configure('./src/templates', { autoescape: true, express: app });

app.get('/healthcheck', (req, res) => {
  return res.send('OK\n');
});
app.use('/', apiRouter);

export const dummy = (a: number): number => {
  return a + 1;
};

export default app;
