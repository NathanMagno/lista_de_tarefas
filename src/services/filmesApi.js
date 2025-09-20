const API_KEY = '6acb0310';
const BASE_URL = 'https://www.omdbapi.com/';

export async function buscarFilmesPorTermo(termo) {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(termo)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro HTTP ${res.status}`);
  }
  const json = await res.json();
  if (json.Response === 'False') {
    const err = new Error(json.Error || 'Falha ao buscar filmes');
    err.reason = json.Error;
    throw err;
  }
  return json.Search || [];
}


export async function buscarDetalhesPorId(imdbID) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro HTTP ${res.status}`);
  }
  const json = await res.json();
  if (json.Response === 'False') {
    const err = new Error(json.Error || 'Falha ao buscar detalhes');
    err.reason = json.Error;
    throw err;
  }
  return json;
}
