import type { Prescription } from '$lib/types/Prescription.js';
import { z } from 'zod';

const basePrescriptionSchema = z.object({
	medication: z.string().min(1, 'Field is required'),
	dosage: z.string().min(1, 'Dosage is required or provide unknown'),
	notes: z.string().nullable(),
	started: z.string().nullable(),
	ended: z.string().nullable(),
	refills: z.number().min(0, 'Required'),
	total: z.number().min(0, 'Required')
});

export const prescriptionSchema = basePrescriptionSchema
	.extend({
		medicationType: z.string().array().min(1, 'Medication type is required!')
	})
	.refine(
		(data) => {
			if (data.started && data.ended)
				return new Date(data.started + 'T00:00:00') <= new Date(data.ended + 'T00:00:00');
			return true;
		},
		{
			message: "Can't end prescription before the day you started it!",
			path: ['prescription.ended']
		}
	);

export type PrescriptionSchemaType = z.infer<typeof prescriptionSchema>;

// Simplified type - no more nested paths needed
export type FormFieldKeys = keyof PrescriptionSchemaType;

export const addRxFormConfig: {
	id: FormFieldKeys;
	title: string;
	type: string;
}[] = [
	{ id: 'medication', title: 'Medication', type: 'text' },
	{ id: 'dosage', title: 'Dosage', type: 'text' },
	{ id: 'notes', title: 'Notes', type: 'text' },
	{
		id: 'started',
		title: 'Started',
		type: 'date'
	},
	{
		id: 'ended',
		title: 'Ended',
		type: 'date'
	},
	{
		id: 'refills',
		title: 'Refills',
		type: 'number'
	},
	{
		id: 'total',
		title: 'Total',
		type: 'number'
	},
	{
		id: 'medicationType',
		title: 'Medication Type',
		type: 'select'
	}
];
