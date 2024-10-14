import axios from "axios";

export default async function Search(query) {
  async function fetchAnimeData(query, page) {
    const url =
      `/api/anime/search?q=${query}&page=${page}` ||
      `/api/anime/search?q=${query}&page=${page}`;
    const response = await axios.get(url);
    return response.data;
  }

  async function fetchAllAnimeData(query) {
    let allData = [];
    for (let page = 1; page <= 5; page++) {
      const data = await fetchAnimeData(query, page);
      allData = { ...allData, ...data };
      if (!data.hasNextPage) break;
    }
    return allData;   
  }

  if (query) {
    const results = await fetchAllAnimeData(query);
    return results;
  }
  return [];
}
