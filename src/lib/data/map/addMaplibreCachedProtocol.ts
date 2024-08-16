import { fetchCachedTile } from '$src/lib/data/cachedDataLoad';
import maplibregl from 'maplibre-gl';

function addMaplibreCachedProtocol() {
	maplibregl.addProtocol('cached', (params, callback) => {
		const httpsUrl = `https://${params.url.split("://")[1]}`;
		fetchCachedTile(httpsUrl)
			.then(t => {
				if (t.status == 200) {
					if (params.type === 'json') {
						t.json().then(json => {
							console.log('style json loaded', json);
							callback(null, json, null, null);
						});
					} else {
						t.arrayBuffer().then(arr => {
							callback(null, arr, null, null);
						});
					}
				} else {
					callback(new Error(`Tile fetch error: ${t.statusText}`));
				}
			})
			.catch(e => {
				callback(new Error(e));
			});
		return { cancel: () => { } };
	});
}
