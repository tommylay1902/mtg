import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	try {
		const response = await fetch('http://mtg_api:8080/api/v1/doctor/all', {
			headers: {
				Authorization: `Bearer ${session?.access_token}`
			}
		});

		const data = await response.json();

		return new Response(JSON.stringify(data), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response(null, { status: 400 });
	}
};
