import { render, screen, waitFor } from '@testing-library/svelte';
import { expect, it, vi, describe } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import PrescriptionForm from './PrescriptionForm.svelte';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { prescriptionSchema } from '$lib/config/form/rxFormConfig.js';

describe('PrescriptionForm Integration Tests', () => {
	const user = userEvent.setup();

	// // Helper to create form with specific data and errors
	// async function createTestForm(data = {}, errors = {}) {
	// 	const form = await superValidate(
	// 		{
	// 			medication: '',
	// 			dosage: '',
	// 			notes: null,
	// 			started: null,
	// 			ended: null,
	// 			refills: 0,
	// 			total: 0,
	// 			prescribedBy: null,
	// 			medicationType: [],
	// 			...data
	// 		},
	// 		zod(prescriptionSchema)
	// 	);

	// 	if (Object.keys(errors).length > 0) {
	// 		form.errors = errors;
	// 	}

	// 	return form;
	// }

	it('should show required field errors', async () => {
		const prescriptionForm = await superValidate(zod(prescriptionSchema));
		console.table(prescriptionForm);

		render(PrescriptionForm, {
			props: {
				prescriptionForm,
				createMedTypeForm: vi.fn(),
				createDoctorForm: vi.fn()
			}
		});

		const button = await screen.findByText('Add Prescription');
		await user.click(button);

		await waitFor(() => {
			expect(screen.getByText(/Name of medication is required/i)).toBeInTheDocument();
			expect(screen.getByText(/Dosage is required/i)).toBeInTheDocument();
		});

		// expect(await screen.findByText('Name of medication is required')).toBeInTheDocument();
		// expect(screen.getByText("Dosage is required or provide value 'unknown'")).toBeInTheDocument();
		// expect(screen.getByText('Please include at least one medication type')).toBeInTheDocument();
	});
});
