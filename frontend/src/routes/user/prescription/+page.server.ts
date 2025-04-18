import type { Actions, PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prescriptionSchema } from '$lib/config/form/addRxFormConfig.js';

export const load: PageServerLoad = async ({ fetch, locals: { safeGetSession } }) => {
	const prescriptionForm = await superValidate(zod(prescriptionSchema));
	const { session } = await safeGetSession();

	const fetchOptions = {
		headers: {
			Authorization: `Bearer ${session?.access_token}`
		}
	};

	const rxResponse = await fetch('/api/prescriptions', fetchOptions);
	//input fetch logic for medication types for drop down list
	const mtResponse = await fetch('/api/medication-type', fetchOptions);

	const prescription = await rxResponse.json();
	const medicationTypes = await mtResponse.json();

	return { prescription, medicationTypes, prescriptionForm };
};

export const actions: Actions = {
	default: async ({ request, fetch, locals: { safeGetSession } }) => {
		const prescriptionForm = await superValidate(request, zod(prescriptionSchema));

		if (!prescriptionForm.valid) return fail(400, { prescriptionForm });
		const { session } = await safeGetSession();

		if (prescriptionForm.data.started)
			prescriptionForm.data.started = new Date(prescriptionForm.data.started).toISOString();
		try {
			const response = await fetch('http://mtg_api:8080/api/v1/prescription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.access_token}`
				},
				body: JSON.stringify(prescriptionForm.data)
			});
			if (!response.ok) {
				const errorData = await response.json();
				console.error('API Error:', errorData);
				return fail(response.status, {
					prescriptionForm,
					error: errorData.message || 'Failed to create prescription'
				});
			}

			const { success } = await response.json();

			return {
				success: true,
				data: { ...prescriptionForm.data, id: success }
			};
		} catch (err) {
			console.error(err);
		}
	}
};
