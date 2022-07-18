async function fetchAndParse(url: URL, json: boolean) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if(json) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .catch(e => {throw new Error(`Failed to load: ${url}\nbecause ${e.message}`)});
}

export async function fetchJSON(url: URL) {
  return this.fetchAndParse(url, true);
}

export async function fetchText(url: URL) {
  return this.fetchAndParse(url, false);
}