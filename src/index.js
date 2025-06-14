import express from "express";
import dotenv from "dotenv";
import db from "./database/configdb.js";
import userRoute from "./routes/user.route.js";
import exampleRoute from "./routes/example.route.js";
import taskRoutes from "./routes/task.route.js"; // Importado para mostrar no Banco do Mongo Express
import cors from 'cors';
import gameRoutes from './routes/game.route.js';
import wishlistRoutes from './routes/wishlist.route.js';
import libraryRoutes from './routes/library.route.js';
import reviewRoutes from './routes/review.route.js';

import User from './models/User.js'; // Importado para mostrar no Banco do Mongo Express

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
    'http://localhost:5173', // ajuste para a porta do seu frontend local
  ],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(swaggerMiddleware); 


app.use("/users", userRoute);

app.use("/secureExampleRoute", exampleRoute);

app.use('/tasks', taskRoutes); // rota protegida

app.get("/", (req, res) => {
    res.send({message: 'Hello World!'});
});

app.use('/games', gameRoutes);

app.use('/wishlist', wishlistRoutes);

app.use('/library', libraryRoutes);

app.use('/games', reviewRoutes);

app.use('/reviews', reviewRoutes);

app.listen(PORT, () => {
    // Por algum motivo, usou acento '`' aqui
    console.log(`Server is running on port http://localhost:${PORT}/`);
    console.log("Hello World");
    console.log("Hello peeeopleee");
});
