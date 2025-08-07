import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import notesRoutes from "./routes/notesRoutes.js";

// ✅ Load environment variables
dotenv.config();

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

const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}
app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

app.use('/api/notes', notesRoutes);

// ✅ Serve frontend (only in production)
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});