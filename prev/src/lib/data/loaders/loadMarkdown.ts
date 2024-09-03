import { variablesBriefMarkdown } from "$src/appstate/variablesMetadata.svelte";
import { loadDataText } from "../cachedDataLoad";
import { dataPathsStartingWith } from "./loadAppData";

export async function loadMarkdown() {
		const promises = dataPathsStartingWith('variables/brief/').map(async (path) => {

			const varname = path.split('/').pop()?.split('.')[0];
			if (!varname) {
				console.error('Failed to extract varname from path', path);
				return;
			}

			return {varname, markdown: await loadDataText(path)};
		});

		const varsBriefs = (await Promise.all(promises)).filter(x => x) as {varname: string, markdown: string}[];

		varsBriefs.forEach(({varname, markdown}) => {
			variablesBriefMarkdown.set(varname, markdown);
		});
		// console.log('VARIABLE BRIEFS', varsBriefs);
}