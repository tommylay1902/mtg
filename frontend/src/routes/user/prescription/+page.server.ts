import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types.js';
import { fail, superForm, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
// const dateSchema = z.preprocess((arg) => {
// 	if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
//   }, z.date());
const prescriptionSchema = z
	.object({
		medication: z.string().min(1, 'Field is required'),
		dosage: z.string().min(1, 'Dosage is required or provide unknown'),
		notes: z.string().nullable(),
		started: z.string(),
		ended: z.string(),
		refills: z.number().min(0)
	})
	.refine(
		(data) => {
			if (data.started)
				return new Date(data.started + 'T00:00:00') <= new Date(data.ended + 'T00:00:00');
			return true;
		},
		{
			message: "Can't end prescription before the day you started it!",
			path: ['ended']
		}
	);

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const prescriptionForm = await superValidate(zod(prescriptionSchema));
	const { session } = await safeGetSession();
	const response = await fetch('http://mtg_api:8080/api/v1/prescription/all', {
		headers: {
			Authorization: `Bearer ${session?.access_token}`
		}
	});

	const prescription = await response.json();
	return { prescription, prescriptionForm };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const prescriptionForm = await superValidate(request, zod(prescriptionSchema));
		console.log(prescriptionForm);
		if (!prescriptionForm.valid) return fail(400, { prescriptionForm });
	}
};
