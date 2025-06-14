import gameService from '../services/game.service.js';
import { fetchGamesFromRawg } from '../services/rawg.service.js';

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

// Novo endpoint para importar jogos da RAWG
const importFromRawg = async (req, res) => {
  try {
    const rawgGames = await fetchGamesFromRawg();
    // Salva apenas se não existir no banco (pelo id da RAWG)
    const savedGames = [];
    for (const rawgGame of rawgGames) {
      const exists = await gameService.findGameByRawgId(rawgGame.id);
      if (!exists) {
        const newGame = await gameService.createGame({
          title: rawgGame.name,
          description: '', // RAWG pode ter descrição, adicione se quiser
          genre: '', // RAWG pode ter gêneros, adicione se quiser
          releaseDate: rawgGame.released,
          rawgId: rawgGame.id,
          background_image: rawgGame.background_image,
          rating: rawgGame.rating,
          ratings_count: rawgGame.ratings_count
        });
        savedGames.push(newGame);
      }
    }
    res.status(201).json({ message: 'Jogos importados!', savedGames });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao importar jogos da RAWG.' });
  }
};

export default { create, getAll, importFromRawg };