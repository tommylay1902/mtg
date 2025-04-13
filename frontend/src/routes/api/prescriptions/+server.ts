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
