export function clickOutside(node: HTMLElement, fn: () => void) {
	// the node has been mounted in the DOM

	window.addEventListener('click', handleClick);

	function handleClick(e: MouseEvent) {
		if (!node.contains(e.target as Node)) {
			console.log('click outside on', node, e.target);

			fn();
		}
	}

	return {
		destroy() {
			// the node has been removed from the DOM
			window.removeEventListener('click', handleClick)
		}
	};
}