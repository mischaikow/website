import { Router } from 'express';

import * as index from './routes/index.js';
import * as scoundrel from './routes/scoundrel.js';

const router = Router();

router.enableRender = (path: string) => router.get(`/${path}`, (_req, res) => res.render(`${path}.njk`));

router.get('/', index.get);
router.get('/scoundrel', scoundrel.get);

export default router;
