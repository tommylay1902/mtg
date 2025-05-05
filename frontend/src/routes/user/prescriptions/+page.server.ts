import type { Actions, PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prescriptionSchema } from '$lib/config/form/rxFormConfig.js';
import { addMedicationTypeSchema } from '$lib/config/form/addMedTypeFormConfig.js';
import { quickAddDoctorFormSchema } from '$lib/config/form/addDoctorFormConfig.js';
import { addPharmacy } from '$lib/config/form/addPharmacyConfig.js';
import { type PharmacyNestedForm } from '$lib/types/PharmacyConfig.js';

export const load: PageServerLoad = async () => {
	try {
		const [prescriptionForm, createMedTypeForm, createDoctorForm, createPharmacyForm] =
			await Promise.all([
				superValidate(zod(prescriptionSchema)),
				superValidate(zod(addMedicationTypeSchema)),
				superValidate(zod(quickAddDoctorFormSchema)),
				superValidate(zod(addPharmacy))
			]);

		return {
			form: { prescriptionForm, createMedTypeForm, createDoctorForm, createPharmacyForm }
		};
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

		if (!createMedTypeForm.valid) return fail(400, { createMedTypeForm });

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
	},

	createDoctor: async ({ request, fetch, locals: { safeGetSession } }) => {
		const createDoctorForm = await superValidate(request, zod(quickAddDoctorFormSchema));

		if (!createDoctorForm.valid) return fail(400, { createDoctorForm });

		try {
			const { session } = await safeGetSession();
			const response = await fetch('http://mtg_api:8080/api/v1/doctor', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.access_token}`
				},
				body: JSON.stringify(createDoctorForm.data)
			});

			const body = await response.json();

			return {
				success: true,
				data: {
					...createDoctorForm.data,
					id: body.success
				},
				form: createDoctorForm
			};
		} catch (err) {
			console.error(err);
		}
	},

	createPharmacy: async ({ request, fetch, locals: { safeGetSession } }) => {
		const createPharmacyForm = await superValidate(request, zod(addPharmacy));

		if (!createPharmacyForm.valid) return fail(400, { createPharmacyForm });

		try {
			const { session } = await safeGetSession();
			const transformedData: PharmacyNestedForm = {
				name: createPharmacyForm.data.name,
				type: 'Pharmacy',
				location: {
					street: createPharmacyForm.data.street,
					city: createPharmacyForm.data.city,
					state: createPharmacyForm.data.state,
					postal_code: createPharmacyForm.data.postal_code,
					country: createPharmacyForm.data.country,
					phone_number: createPharmacyForm.data.phone_number
				}
			};

			const response = await fetch('http://mtg_api:8080/api/v1/healthcare-facility', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.access_token}`
				},
				body: JSON.stringify(transformedData)
			});
			const body = await response.json();
			return {
				success: true,
				data: {
					...createPharmacyForm.data,
					id: body.success
				},
				form: createPharmacyForm
			};
		} catch (err) {
			console.error(err);
		}
	}
};
