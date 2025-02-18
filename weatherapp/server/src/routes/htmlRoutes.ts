import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// ✅ Serve the index.html file
router.get('/', (_req, res) => {
  const filePath = path.join(__dirname, '../../../client/dist/index.html');
  res.sendFile(filePath);
  console.log("Serving index.html from:", filePath);
});

// ✅ Serve static assets from client/dist
router.use(express.static(path.join(__dirname, '../../client/dist')));

export default router;