import { z } from 'zod';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	const response = await fetch('http://mtg_api:8080/api/v1/prescription/all', {
		headers: {
			Authorization: `Bearer ${session?.access_token}`
		}
	});

	const prescription = await response.json();
	return { prescription };
};
