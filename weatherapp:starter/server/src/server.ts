import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
