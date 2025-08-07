import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import notesRoutes from './routes/notesRoutes.js';

// ✅ Load environment variables
dotenv.config();

const app = express();
connectDB(); // ✅ Connect to MongoDB

// ✅ Middleware
app.use(express.json());
app.use(rateLimiter);

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://notes-app-frontend-abc1.onrender.com"
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ API Routes
app.use('/api/notes', notesRoutes);

// ✅ Serve frontend (only in production)
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
