export const GET = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	try {
		const response = await fetch('http://mtg_api:8080/api/v1/prescription/all', {
			headers: {
				Authorization: `Bearer ${session?.access_token}`
			}
		});

		const data = await response.json();

		return new Response(JSON.stringify(data), { status: 200 });
	} catch (err) {
		console.error(err);
	}
};

export const DELETE = async ({ request, locals: { safeGetSession } }) => {
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
	}
};

export const PUT = async ({ request, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	try {
		const prescriptions = await request.json();
		console.log(prescriptions);
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
	} catch (err) {}
};
