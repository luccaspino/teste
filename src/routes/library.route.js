import express from 'express';
import libraryController from '../controller/library.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Library
 *   description: Gerenciamento da biblioteca de jogos do usuário
 */

/**
 * @swagger
 * /library:
 *   get:
 *     summary: Retorna os jogos da biblioteca do usuário
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jogos na biblioteca
 */
router.get('/', libraryController.getLibrary);

/**
 * @swagger
 * /library/add:
 *   post:
 *     summary: Adiciona um jogo à biblioteca
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               gameId: "abc123"
 *     responses:
 *       201:
 *         description: Jogo adicionado à biblioteca
 */
router.post('/add', libraryController.addGame);

/**
 * @swagger
 * /library/remove:
 *   post:
 *     summary: Remove um jogo da biblioteca
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               gameId: "abc123"
 *     responses:
 *       200:
 *         description: Jogo removido da biblioteca
 */
router.post('/remove', libraryController.removeGame);

export default router;
