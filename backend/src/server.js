import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import notesRoutes from './routes/notesRoutes.js';


dotenv.config();


// console.log(process.env.MONGO_URI);

const app = express();


connectDB();
// Middleware to parse JSON bodies
app.use(express.json());
app.use(rateLimiter);
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})); // Allow all for now


// app.use((req, res, next) => {
//   console.log(`request method: ${req.method}, Request URL: ${req.url}`);
//   next();
// });

app.use('/api/notes', notesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
