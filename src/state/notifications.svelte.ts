export const notifications: string[] = $state([]);

export const notify = (text: string) => {
	notifications.push(text);
	setTimeout(() => {
		closeNotification(text);
	}, 2000);
};


export const closeNotification = (text: string) => {
	notifications.splice(notifications.indexOf(text), 1);
}