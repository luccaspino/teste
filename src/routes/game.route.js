import express from 'express';
import gameController from '../controller/game.controller.js';
import rawgController from '../controller/rawg.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Gerenciamento de jogos
 */

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Cria um novo jogo
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: "The Witcher 3"
 *               genre: "RPG"
 *     responses:
 *       201:
 *         description: Jogo criado com sucesso
 */
router.post('/', gameController.create);

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Lista todos os jogos
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Lista de jogos
 */
router.get('/', gameController.getAll);

/**
 * @swagger
 * /games/import-rawg:
 *   post:
 *     summary: Importa jogos da API RAWG
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Jogos importados com sucesso
 */
router.post('/import-rawg', rawgController.importFromRawg);

export default router;
