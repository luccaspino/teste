import Library from '../models/Library.js';

const getLibraryByUser = async (userId) =>
  Library.findOne({ userId }).populate('games');

const addGameToLibrary = async (userId, gameId) => {
  let library = await Library.findOne({ userId });
  if (!library) {
    library = new Library({ userId, games: [gameId] });
  } else if (!library.games.includes(gameId)) {
    library.games.push(gameId);
  }
  return library.save();
};

const removeGameFromLibrary = async (userId, gameId) => {
  const library = await Library.findOne({ userId });
  if (!library) return null;
  library.games = library.games.filter(id => id.toString() !== gameId);
  return library.save();
};

export default { getLibraryByUser, addGameToLibrary, removeGameFromLibrary };