import express from 'express';
import wishlistController from '../controller/wishlist.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Gerenciamento da lista de desejos do usuário
 */

router.use(verifyToken);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Retorna os jogos da wishlist do usuário autenticado
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jogos na wishlist
 *       401:
 *         description: Não autorizado
 */
router.get('/', wishlistController.getWishlist);

/**
 * @swagger
 * /wishlist/add:
 *   post:
 *     summary: Adiciona um jogo à wishlist
 *     tags: [Wishlist]
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
 *         description: Jogo adicionado à wishlist
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/add', wishlistController.addGame);

/**
 * @swagger
 * /wishlist/remove:
 *   post:
 *     summary: Remove um jogo da wishlist
 *     tags: [Wishlist]
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
 *         description: Jogo removido da wishlist
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/remove', wishlistController.removeGame);

export default router;
