import { z } from 'zod';
import { formatISODateForHtmlInput } from '$lib/format/formatDate.js';

const basePrescriptionSchema = z.object({
	medication: z.string().min(1, 'Name of medication is required'),
	dosage: z.string().min(1, "Dosage is required or provide value 'unknown'"),
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
				type: z.string(),
				color: z.string()
			})
			.array()
			.min(1, 'Please include at least one medication type')
	})
	.refine(
		(data) => {
			if (data.started && data.ended)
				return new Date(data.started + 'T00:00:00') <= new Date(data.ended + 'T00:00:00');
			return true;
		},
		{
			message: "Prescriptions can't have an end date before the start date",
			path: ['ended']
		}
	);

export type PrescriptionSchemaType = z.infer<typeof prescriptionSchema>;
export type FormFieldKeys = keyof PrescriptionSchemaType;

const defaultTransform = (v: string) => v;

export type rxFormConfigFields = {
	id: FormFieldKeys;
	title: string;
	type: string;
	space: string;
	placeholder?: string;
	transform: (data: any) => string | null;
};

export const rxFormConfig: rxFormConfigFields[] = [
	{
		id: 'medication',
		title: 'Medication',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'Name of medication...',
		transform: defaultTransform
	},
	{
		id: 'dosage',
		title: 'Dosage',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'e.g. 200mg tablet daily',
		transform: defaultTransform
	},
	{
		id: 'notes',
		title: 'Notes',
		type: 'text',
		space: 'col-span-4',
		placeholder: 'Additional notes (why are we taking this, what is it used for...etc.)',
		transform: defaultTransform
	},
	{
		id: 'started',
		title: 'Started',
		type: 'date',
		space: 'col-span-2',
		transform: (v: string | null) => (v ? formatISODateForHtmlInput(v) : '')
	},
	{
		id: 'ended',
		title: 'Ended',
		type: 'date',
		space: 'col-span-2',
		transform: (v: string | null) => (v ? formatISODateForHtmlInput(v) : '')
	},
	{
		id: 'refills',
		title: 'Refills',
		type: 'number',
		space: 'col-span-2',
		transform: (v: number) => v.toString()
	},
	{
		id: 'total',
		title: 'Total',
		type: 'number',
		space: 'col-span-2',
		transform: (v: number) => v.toString()
	},
	{
		id: 'prescribedBy',
		title: 'Prescribed By',
		type: 'select',
		space: 'col-span-4',
		placeholder: 'Who placed the order?',
		transform: defaultTransform
	},
	{
		id: 'medicationType',
		title: 'Medication Type',
		type: 'select',
		space: 'col-span-4',
		transform: defaultTransform
	}
];
