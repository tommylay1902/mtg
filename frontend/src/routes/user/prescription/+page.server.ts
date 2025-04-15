import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types.js';
import { fail, superForm, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const prescriptionSchema = z
	.object({
		medication: z.string().min(1, 'Field is required'),
		dosage: z.string().min(1, 'Dosage is required or provide unknown'),
		notes: z.string().nullable(),
		started: z.string(),
		ended: z.string().nullable(),
		refills: z.number().min(0)
	})
	.refine(
		(data) => {
			if (data.started && data.ended)
				return new Date(data.started + 'T00:00:00') <= new Date(data.ended + 'T00:00:00');
			return true;
		},
		{
			message: "Can't end prescription before the day you started it!",
			path: ['ended']
		}
	);

export const load: PageServerLoad = async ({ depends, fetch, locals: { safeGetSession } }) => {
	const prescriptionForm = await superValidate(zod(prescriptionSchema));
	const { session } = await safeGetSession();

	const response = await fetch('/api/prescriptions', {
		headers: {
			Authorization: `Bearer ${session?.access_token}`
		}
	});

	const prescription = await response.json();

	return { prescription, prescriptionForm };
};

export const actions: Actions = {
	default: async ({ request, fetch, locals: { safeGetSession } }) => {
		const prescriptionForm = await superValidate(request, zod(prescriptionSchema));

		if (!prescriptionForm.valid) return fail(400, { prescriptionForm });
		const { session } = await safeGetSession();

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

			const id = await response.json();

			return {
				success: true,
				data: { ...prescriptionForm.data, id }
			};
		} catch (err) {
			console.error(err);
		}
	}
};
