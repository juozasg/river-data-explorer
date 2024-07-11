// import { notify } from "./notifications.svelte";


export const startedLoading = (label: string) => {
	// return close() function
	// console.log('startedLoading', label);
	// const closeNotification = notify(`Loading ${label}...`, 'info', 0);

	return () => {
		// closeNotification();
		// console.log('finishedLoading', label);
	};

	// loadingItems.push([id, label]);
};

// type LoadingItem = [string, string];
// let loadingItems: LoadingItem[] = $state([]);



// export const finishedLoading = (id: string) => {
// notify(`Loading ${name}...`);
// loadingItems = loadingItems.filter((i) => i[0] !== id);
// };
