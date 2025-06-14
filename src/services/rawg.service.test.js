import { fetchGamesFromRawg } from './rawg.service.js';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => jest.fn());

describe('fetchGamesFromRawg', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os resultados dos jogos quando a resposta for bem-sucedida', async () => {
    const mockResults = [{ id: 1, name: 'Game 1' }, { id: 2, name: 'Game 2' }];
    const mockJson = jest.fn().mockResolvedValue({ results: mockResults });
    fetch.mockResolvedValue({ ok: true, json: mockJson });

    const result = await fetchGamesFromRawg();

    expect(fetch).toHaveBeenCalled();
    expect(result).toEqual(mockResults);
  });

  it('deve lançar um erro quando a resposta não for ok', async () => {
    fetch.mockResolvedValue({ ok: false });

    await expect(fetchGamesFromRawg()).rejects.toThrow('Failed to fetch games from RAWG');
  });
});