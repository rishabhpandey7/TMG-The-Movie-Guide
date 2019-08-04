const api = 'https://api.themoviedb.org/3';
const key = '0a006db6cf3451fcf38c0518092cc84e';

const defaultContent = {
  api_key: key,
  language: 'en-US'
};

function queryString(obj) {
  return Object.entries(obj)
    .map(([index, val]) => `${index}=${val}`)
    .join('&');
}

export default async function request(url, content = {}, debug = false) {
  const obj = { ...defaultContent, ...content };

  const response = await fetch(`${api}/${url}?${queryString(obj)}`);
  const data = await (debug ? response.status : response.json());

  return data;
}