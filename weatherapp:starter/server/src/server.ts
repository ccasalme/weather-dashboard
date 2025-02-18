import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Fix `__dirname` for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static files from `client/dist`
app.use(express.static(path.join(__dirname, '../client/dist')));

// ✅ Middleware for parsing JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect all routes
app.use(routes);

// ✅ Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
