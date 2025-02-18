import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// ✅ Serve the index.html file
router.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// ✅ Serve static assets from client/dist
router.use(express.static(path.join(__dirname, '../../client/dist')));

export default router;