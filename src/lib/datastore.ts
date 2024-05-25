// https://raw.githubusercontent.com/juozasg/SJRBC-web-map-data/webapp/features/counties.csv
export async function loadCsv(path: string) {
	const url = `https://raw.githubusercontent.com/juozasg/SJRBC-web-map-data/webapp/${path}`;
	const response = await fetch(url);
	const text = await response.text();

	// or laod indexedDB
	// invalidate indexedb by build number (or data commit version)
	// wait is there any point with web caching?

}