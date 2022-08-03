async function fetchAndParse(url: string, json: boolean) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText);
      }
      if(json) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .catch(e => {throw new Error(`Failed to load: ${url}\nbecause: ${e.message}`)});
}

export async function fetchJSON(url: string) {
  return fetchAndParse(url, true);
}

export async function fetchText(url: string) {
  return fetchAndParse(url, false);
}