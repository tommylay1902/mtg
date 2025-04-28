import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import CreateMedTypeForm from './CreateMedTypeForm.svelte';

describe('CreateMedTypeForm', () => {
	it('renders correctly', async () => {
		render(CreateMedTypeForm);

		expect(screen.getByLabelText('Medication Type')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
	});
});
