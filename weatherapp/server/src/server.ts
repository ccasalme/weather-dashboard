import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import routes from './routes/index.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
