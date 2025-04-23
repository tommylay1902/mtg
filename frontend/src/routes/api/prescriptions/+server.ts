import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { safeGetSession }, url }) => {
	const { session } = await safeGetSession();
	const requestType = url.searchParams.get('type');

	try {
		let endpoint = '';
		switch (requestType) {
			case 'prescriptions':
				endpoint = 'http://mtg_api:8080/api/v1/prescription/all';
				break;
			case 'medication-types':
				const prescriptionId = url.searchParams.get('prescription_id');
				endpoint = `http://mtg_api:8080/api/v1/prescription/${prescriptionId}/medication-types`;
				break;
			default:
				return new Response(JSON.stringify({ error: 'Invalid request type' }), {
					status: 400
				});
		}
		const response = await fetch(endpoint, {
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

export const DELETE: RequestHandler = async ({ request, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	try {
		const { ids } = await request.json();

		const response = await fetch('http://mtg_api:8080/api/v1/prescription', {
			method: 'DELETE',

			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session?.access_token}`
			},
			body: JSON.stringify({ deleteList: ids })
		});

		const data = await response.json();

		return new Response(JSON.stringify(data), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response(null, { status: 400 });
	}
};

export const PUT: RequestHandler = async ({ request, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	try {
		const prescriptions = await request.json();

		const response = await fetch('http://mtg_api:8080/api/v1/prescription', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session?.access_token}`
			},
			body: JSON.stringify(prescriptions)
		});
		const data = await response.json();
		return new Response(JSON.stringify(data), { status: 200 });
	} catch (err) {
		return new Response(null, { status: 400 });
	}
};
