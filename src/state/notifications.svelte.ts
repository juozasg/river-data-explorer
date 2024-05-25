export const notifications: string[] = $state([]);

type LoadingItem = [string, string];
let loadingItems: LoadingItem[] = $state([]);

export const notify = (text: string) => {
	notifications.push(text);
	setTimeout(() => {
		closeNotification(text);
	}, 2000);
};


export const closeNotification = (text: string) => {
	notifications.splice(notifications.indexOf(text), 1);
}

export const startedLoading = (id: string, label: string) => {
	notify(`Loading ${label}...`);
	loadingItems.push([id, label]);
}


export const finishedLoading = (id: string) => {
	// notify(`Loading ${name}...`);
	loadingItems = loadingItems.filter((i) => i[0] !== id);
}


