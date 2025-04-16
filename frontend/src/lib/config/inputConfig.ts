import type { Prescription } from '$lib/components/prescription/table/Columns.js';
import { formatISODateForHtmlInput } from '$lib/format/formatDate.js';

export const prescriptinInputConfigs: {
	id: keyof Prescription;
	title: string;
	type: string;
	transform: (data: any) => string | null;
}[] = [
	{ id: 'medication', title: 'Medication', type: 'text', transform: (v: string) => v },
	{ id: 'dosage', title: 'Dosage', type: 'text', transform: (v: string) => v },
	{ id: 'notes', title: 'Notes', type: 'text', transform: (v: string) => v },
	{
		id: 'started',
		title: 'Started',
		type: 'date',
		transform: (v: string | null) => (v ? formatISODateForHtmlInput(v) : '')
	},
	{
		id: 'ended',
		title: 'Ended',
		type: 'date',
		transform: (v: string | null) => (v ? formatISODateForHtmlInput(v) : '')
	},
	{
		id: 'refills',
		title: 'Refills',
		type: 'number',
		transform: (v: number) => v.toString()
	}
];
