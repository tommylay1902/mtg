import { z } from 'zod';
export const location = z.object({
	street: z.string().min(1, 'street required'),
	city: z.string().min(1, 'city required'),
	state: z.string().min(1, 'state required'),
	phone_number: z.string().min(1, 'street required')
});

export type AddLocationSchema = z.infer<typeof location>;

export type FormFieldKeys = keyof AddLocationSchema;

export type addLocationConfigFormFields = {
	id: FormFieldKeys;
	title: string;
	type: string;
	space: string;
	placeholder?: string;
	transform: (data: any) => string | null;
};

export const AddLocationFormConfig: addLocationConfigFormFields[] = [
	{
		id: 'street',
		title: 'Street',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'Street pharmacy located on...',
		transform: (data: any) => data
	},
	{
		id: 'city',
		title: 'City',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'City pharmacy located...',
		transform: (data: any) => data
	},
	{
		id: 'state',
		title: 'State',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'State pharmacy is located...',
		transform: (data: any) => data
	},
	{
		id: 'phone_number',
		title: 'Phone Number',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'Pharmacy contact number...',
		transform: (data: any) => data
	}
];
