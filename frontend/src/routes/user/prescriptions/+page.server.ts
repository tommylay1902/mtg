import type { Actions, PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prescriptionSchema } from '$lib/config/form/rxFormConfig.js';
import { addMedicationTypeSchema } from '$lib/config/form/addMedTypeFormConfig.js';
import type { MedicationType } from '$lib/types/MedicationType.js';

export const load: PageServerLoad = async ({ fetch, locals: { safeGetSession } }) => {
	try {
		const prescriptionForm = await superValidate(zod(prescriptionSchema));
		const createMedTypeForm = await superValidate(zod(addMedicationTypeSchema));
		const { session } = await safeGetSession();

		const fetchOptions = {
			headers: {
				Authorization: `Bearer ${session?.access_token}`
			}
		};

		const rxResponse = await fetch('/api/prescriptions?type=prescriptions', fetchOptions);

		//input fetch logic for medication types for drop down list
		const mtResponse = await fetch('/api/medication-type', fetchOptions);

		const prescription = await rxResponse.json();
		const medicationTypes: MedicationType[] = await mtResponse.json();
		console.log(medicationTypes);

		return { prescription, medicationTypes, form: { prescriptionForm, createMedTypeForm } };
	} catch (err) {
		console.error(err);
		return {};
	}
};

export const actions: Actions = {
	createPrescription: async ({ request, fetch, locals: { safeGetSession } }) => {
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
			// take a look while refactoring
			return {
				success: true,
				data: { ...prescriptionForm.data, id: success },
				form: prescriptionForm
			};
		} catch (err) {
			console.error(err);
		}
	},
	createMedType: async ({ request, fetch, locals: { safeGetSession } }) => {
		const createMedTypeForm = await superValidate(request, zod(addMedicationTypeSchema));
		if (!createMedTypeForm.valid) return fail(400, createMedTypeForm);

		try {
			const { session } = await safeGetSession();
			const response = await fetch('http://mtg_api:8080/api/v1/medication-type', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.access_token}`
				},
				body: JSON.stringify(createMedTypeForm.data)
			});

			const { success } = await response.json();

			return {
				success: true,
				data: {
					...createMedTypeForm.data,
					id: success
				},
				form: createMedTypeForm
			};
		} catch (err) {
			console.error(err);
		}
	}
};
