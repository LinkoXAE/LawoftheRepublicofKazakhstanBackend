import { LOCAL_API } from './config';

export async function getDocument(url: string) {
  const res = await fetch(
    `${LOCAL_API}/document?url=${encodeURIComponent(url)}`
  );
  if (!res.ok) throw new Error('Ошибка сервера');
  return res.json();
}

export async function searchAdilet(q: string) {
  const res = await fetch(`${LOCAL_API}/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function analyzeText(text: string) {
  const res = await fetch(`${LOCAL_API}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export function checkOnline() {
  return navigator.onLine;
}
