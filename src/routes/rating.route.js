import express from 'express';
import ratingController from '../controller/rating.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Gerenciamento de avaliações de jogos
 */

/**
 * @swagger
 * /ratings/game/{gameId}:
 *   get:
 *     summary: Lista todas as avaliações de um jogo
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do jogo
 *     responses:
 *       200:
 *         description: Lista de avaliações do jogo
 */
router.get('/game/:gameId', ratingController.getRatingsByGame);

/**
 * @swagger
 * /ratings/game/{gameId}/average:
 *   get:
 *     summary: Retorna a média de avaliações de um jogo
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do jogo
 *     responses:
 *       200:
 *         description: Média de avaliações do jogo
 */
router.get('/game/:gameId/average', ratingController.getAverageRatingByGame);

/**
 * @swagger
 * /ratings/game/{gameId}/user:
 *   get:
 *     summary: Retorna a avaliação do usuário para um jogo específico
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do jogo
 *     responses:
 *       200:
 *         description: Avaliação do usuário
 *       401:
 *         description: Não autorizado
 */
router.get('/game/:gameId/user', verifyToken, ratingController.getRatingByUserAndGame);

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Cria uma nova avaliação
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *               - rating
 *             properties:
 *               gameId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post('/', verifyToken, ratingController.createRating);

/**
 * @swagger
 * /ratings:
 *   put:
 *     summary: Atualiza uma avaliação existente
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *               - rating
 *             properties:
 *               gameId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.put('/', verifyToken, ratingController.updateRating);

/**
 * @swagger
 * /ratings:
 *   delete:
 *     summary: Remove uma avaliação
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *             properties:
 *               gameId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avaliação removida com sucesso
 *       401:
 *         description: Não autorizado
 */
router.delete('/', verifyToken, ratingController.deleteRating);

export default router; 