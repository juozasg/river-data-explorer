export async function retryingFetch(url: string, response?: Response) {
	response = await fetch(url);

	if (response.status === 202) {
		const retries = 4;
		let retryCount = 0;
		while (response.status === 202 && retryCount < retries) {
			console.log('retrying', url);
			const retryTime = 1000 & (3 ** retryCount);
			await new Promise(resolve => setTimeout(resolve, retryTime));
			response = await fetch(url);
			retryCount++;
		}
	}
	return response;
}
