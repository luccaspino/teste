import express from "express";
import dotenv from "dotenv";
import db from "./database/configdb.js";
import userRoute from "./routes/user.route.js";
import exampleRoute from "./routes/example.route.js";
import taskRoutes from "./routes/task.route.js";
import cors from 'cors';
import gameRoutes from './routes/game.route.js';
import wishlistRoutes from './routes/wishlist.route.js';
import libraryRoutes from './routes/library.route.js';
import reviewRoutes from './routes/review.route.js';
import ratingRoutes from './routes/rating.route.js';

import User from './models/User.js';
import swaggerMiddleware from "./middleware/swagger.js";

dotenv.config();
db.connect();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    'https://api-games.vercel.app',
    'https://api-games-backend.vercel.app',
    'https://api-games-mqct.onrender.com',
    'http://localhost:5173',
  ],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(swaggerMiddleware);

// Rotas públicas
app.get("/", (req, res) => {
    res.send({message: 'Hello World!'});
});

// Rotas da API
app.use("/users", userRoute);
app.use('/games', gameRoutes);
app.use('/reviews', reviewRoutes);
app.use('/ratings', ratingRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/library', libraryRoutes);

// Rotas de exemplo e teste
app.use("/secureExampleRoute", exampleRoute);
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});
