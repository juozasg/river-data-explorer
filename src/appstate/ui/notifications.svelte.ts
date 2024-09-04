export type NotificationLevel = 'info' | 'warn' | 'error';

export type Notification = {
	id: number;
	level: NotificationLevel;
	message: string;
};

let _notifications: Notification[] = $state([]);

export const notifications = () => _notifications;


// const isLoading = $derived(loadingItems.length > 0);
// const loadingMessage = $derived(isLoading ? `Loading ${loadingItems[0][1]}...` : 'Done');


let nextId = 1;
export const notify = (message: string, level: NotificationLevel = 'info', fadeout: number = 2000) => {
	const id = nextId++;

	_notifications.push({ id, level, message });
	if(fadeout !== 0) {
		setTimeout(() => {
			closeNotification(id);
		}, fadeout);
	}

	return () => closeNotification(id);
};

export const closeNotification = (id: number) => {
	_notifications = _notifications.filter(n => n.id !== id);
}



