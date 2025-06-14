import fetch from 'node-fetch';

const API_KEY = 'ac25b624a98d4348bc5c4a45abb34eed';

export const fetchGamesFromRawg = async () => {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&dates=2011-01-01,2024-12-31&ordering=-added&page_size=21`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch games from RAWG');
  const data = await response.json();
  return data.results;
};