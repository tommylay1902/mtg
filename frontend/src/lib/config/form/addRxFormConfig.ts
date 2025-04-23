import { z } from 'zod';

const basePrescriptionSchema = z.object({
	medication: z.string().min(1, 'Field is required'),
	dosage: z.string().min(1, 'Dosage is required or provide unknown'),
	notes: z.string().nullable(),
	started: z.string().nullable(),
	ended: z.string().nullable(),
	refills: z.number().min(0, 'Required'),
	total: z.number().min(0, 'Required'),
	prescribedBy: z.string()
});

export const prescriptionSchema = basePrescriptionSchema
	.extend({
		medicationType: z
			.object({
				id: z.string(),
				type: z.string()
			})
			.array()
			.min(1, 'Medication type is required!')
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
	space: string;
}[] = [
	{ id: 'medication', title: 'Medication', type: 'text', space: 'col-span-2' },
	{ id: 'dosage', title: 'Dosage', type: 'text', space: 'col-span-2' },
	{ id: 'notes', title: 'Notes', type: 'text', space: 'col-span-4' },
	{
		id: 'started',
		title: 'Started',
		type: 'date',
		space: 'col-span-2'
	},
	{
		id: 'ended',
		title: 'Ended',
		type: 'date',
		space: 'col-span-2'
	},
	{
		id: 'refills',
		title: 'Refills',
		type: 'number',
		space: 'col-span-2'
	},
	{
		id: 'total',
		title: 'Total',
		type: 'number',
		space: 'col-span-2'
	},
	{
		id: 'prescribedBy',
		title: 'Prescribed By',
		type: 'select',
		space: 'col-span-4'
	},
	{
		id: 'medicationType',
		title: 'Medication Type',
		type: 'select',
		space: 'col-span-4'
	}
];
