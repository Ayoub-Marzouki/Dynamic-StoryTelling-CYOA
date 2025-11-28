import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import storyRoutes from "./routes/stories.js";
import userRoutes from "./routes/users.js";
import genreRoutes from "./routes/genres.js";

export default function createServer() {
    const app = express();
    app.use(express.json()); // to transform JSON text sent by client into parsed JSON
    app.use(cors()); // to allow communication between frontend and backend

    app.use('/api/auth', authRoutes);
    app.use('/api/stories', storyRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/genres', genreRoutes);

    return app;
}