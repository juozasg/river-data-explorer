import { toast } from '@zerodevx/svelte-toast'
export type NotificationLevel = 'info' | 'warn' | 'error';

// export type Notification = {
// 	id: number;
// 	level: NotificationLevel;
// 	message: string;
// };

// let _notifications: Notification[] = $state([]);

// export const notifications = () => _notifications;


// const isLoading = $derived(loadingItems.length > 0);
// const loadingMessage = $derived(isLoading ? `Loading ${loadingItems[0][1]}...` : 'Done');


// let nextId = 1;
export const notify = (message: string, level: NotificationLevel = 'info', duration: number = 2000) => {

	let theme = {
		'--toastColor': 'mintcream',
    '--toastBackground': 'rgba(72,187,120,0.9)',
    '--toastBarBackground': '#2F855A'
	}

	if(level === 'warn') {
		theme['--toastBackground'] = 'rgba(255,191,0,0.9)';
	}

	if(level === 'error') {
		theme['--toastBackground'] = 'rgba(220,38,38,0.9)';
	}

	toast.push(message, {
		theme: {
			...theme,
			'--toastBarHeight': 0,
		},
		duration: duration,
	})

	// const id = nextId++;

	// _notifications.push({ id, level, message });
	// if(fadeout !== 0) {
	// 	setTimeout(() => {
	// 		closeNotification(id);
	// 	}, fadeout);
	// }

	// return () => closeNotification(id);
};

export const closeNotification = (id: number) => {
	// _notifications = _notifications.filter(n => n.id !== id);
}



