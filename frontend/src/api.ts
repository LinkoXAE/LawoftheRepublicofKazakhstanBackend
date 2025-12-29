const API = 'http://localhost:3001/api';

export async function searchAdilet(q: string) {
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function getDocument(url: string) {
  const res = await fetch(`${API}/document?url=${encodeURIComponent(url)}`);
  return res.json();
}

export async function analyzeText(query: string) {
  const res = await fetch(`${API}/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return { results: data };
}
