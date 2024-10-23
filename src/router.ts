import { Router } from 'express';

import * as home from './routes/home.js';

const router = Router();

router.enableRender = (path) => router.get(`/${path}`, (_req, res) => res.render(`${path}.njk`));

router.get('/home', home.get);

export default router;
