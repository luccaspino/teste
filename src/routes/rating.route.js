import express from 'express';
import ratingController from '../controller/rating.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

// Rotas públicas
router.get('/game/:gameId', ratingController.getRatingsByGame);
router.get('/game/:gameId/average', ratingController.getAverageRatingByGame);

// Rotas protegidas
router.get('/game/:gameId/user', verifyToken, ratingController.getRatingByUserAndGame);
router.post('/', verifyToken, ratingController.createRating);
router.put('/', verifyToken, ratingController.updateRating);
router.delete('/', verifyToken, ratingController.deleteRating);

export default router; 