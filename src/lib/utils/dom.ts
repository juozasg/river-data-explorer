export const scrollElementIntoView = (id: string) => {
	if(typeof window === 'undefined') return;
	const basinRegionsA = window.document.getElementById(id);
	basinRegionsA?.scrollIntoView({ behavior: 'instant', block: 'start' });
};

export function findAncestor(el: HTMLElement | null, cls: any) {
	if (!el) return null;
	while ((el = el.parentElement) && !el.classList.contains(cls));
	return el;
}
