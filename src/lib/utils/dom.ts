export const scrollIntoViewRegionMap = () => {
	if(typeof window === 'undefined') return;
	const basinRegionsA = window.document.getElementById('basin-regions');
	basinRegionsA?.scrollIntoView({ behavior: 'instant', block: 'start' });
};