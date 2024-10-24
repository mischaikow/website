import { Router } from 'express';

import * as index from './routes/index.js';

const router = Router();

router.enableRender = (path: string) => router.get(`/${path}`, (_req, res) => res.render(`${path}.njk`));

router.get('/', index.get);

export default router;
