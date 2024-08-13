import type { HandleServerError } from "@sveltejs/kit";

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	// const errorId = crypto.randomUUID();

	console.log('ERROR EVENT', event);

	return {
		error,
		status,
		// event, // makes it crash
		message: 'Internal Error',
	};
};
