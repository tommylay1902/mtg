import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	const requestType = url.searchParams.get('type');
	let endpoint = 'http://mtg_api:8080/api/v1/healthcare-facility';

	switch (requestType) {
		case 'pharmacy':
			endpoint += '/pharmacy/all';
			break;
		default:
			endpoint += 'all';
	}

	try {
		const response = await fetch(endpoint, {
			headers: {
				Authorization: `Bearer ${session?.access_token}`
			}
		});

		const data = await response.json();

		console.log(data);

		return new Response(JSON.stringify(data), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response(null, { status: 400 });
	}
};
