import { formatISODateForHtmlInput } from '$lib/format/formatDate.js';
import { type FormFieldKeys } from './form/addRxFormConfig.js';

export const prescriptinInputConfigs: {
	id: FormFieldKeys;
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
	},
	{
		id: 'prescribedBy',
		title: 'Prescribed By',
		type: 'select',
		transform: (v: any) => v
	},
	{
		id: 'medicationType',
		title: 'Medication Type',
		type: 'select',
		transform: (v: any) => v
	}
];
