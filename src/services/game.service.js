import Game from '../models/Game.js';

const createGame = async (data) => await Game.create(data);
const getAllGames = async () => await Game.find();
const findGameByRawgId = async (rawgId) => await Game.findOne({ rawgId });

export default { createGame, getAllGames, findGameByRawgId };