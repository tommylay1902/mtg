import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, fetch, locals: { safeGetSession } }) => {
	if (params.id) {
		const { session } = await safeGetSession();
		const rxResponse = await fetch(`http://mtg_api:8080/api/v1/prescription/${params.id}`, {
			headers: {
				Authorization: `Bearer ${session?.access_token}`
			}
		});
		const rx = await rxResponse.json();
		console.log(rx);
		return {
			prescription: rx
		};
	}
};
