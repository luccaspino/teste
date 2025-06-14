import gameService from '../services/game.service.js';

const create = async (req, res) => {
  try {
    const game = await gameService.createGame(req.body);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar jogo.' });
  }
};

const getAll = async (req, res) => {
  try {
    const games = await gameService.getAllGames();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar jogos.' });
  }
};

export default { create, getAll };