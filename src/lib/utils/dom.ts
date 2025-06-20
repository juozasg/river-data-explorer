export const scrollElementIntoView = (id: string) => {
	if (typeof window === 'undefined') return;
	const basinRegionsA = window.document.getElementById(id);
	basinRegionsA?.scrollIntoView({ behavior: 'instant', block: 'start' });
};

export function findAncestor(el: HTMLElement | null, cls: any) {
	if (!el) return null;
	while ((el = el.parentElement) && !el.classList.contains(cls));
	return el;
}


export function elementInView(container: HTMLElement, element: HTMLElement, partial: boolean = false): boolean {
	//Get container properties
	let cTop = container.scrollTop;
	let cBottom = cTop + container.clientHeight;

	//Get element properties
	let eTop = element.offsetTop - container.offsetTop; // change here
	let eBottom = eTop + element.clientHeight;

	//Check if in view
	let isTotal = (eTop >= cTop && eBottom <= cBottom);
	let isPartial = partial && (
		(eTop < cTop && eBottom > cTop) ||
		(eBottom > cBottom && eTop < cBottom)
	);

	//Return outcome
	return (isTotal || isPartial);
}


export async function isElementInScrollView(element: HTMLElement) {
	return new Promise((resolve) => {
		const observer = new IntersectionObserver(
			(entries, observerItself) => {
				observerItself.disconnect();
				resolve(entries[0].intersectionRatio === 1);
			}
		);
		observer.observe(element);
	});
}
