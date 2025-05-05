import { type PharmacyFlatForm } from '$lib/types/PharmacyConfig.js';
import { z } from 'zod';

export const addPharmacy = z.object({
	name: z.string().min(1, 'Need to specify name for the pharmacy'),

	street: z.string().min(1, 'Street address is required'),
	city: z.string().min(1, 'City is required'),
	state: z.string().min(1, 'State is required'),
	postal_code: z.string().min(1, 'Postal code is required'),
	country: z.string().min(1, 'Country is required'),
	phone_number: z.string().min(1, 'Phone number is required')
});

export type AddPharmacySchema = z.infer<typeof addPharmacy>;

export const AddPharmacyFlatConfig = [
	{
		id: 'name',
		title: 'Pharmacy Name',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'Enter name of Pharmacy...'
	},
	{
		id: 'street',
		title: 'Street Address',
		type: 'text',
		space: 'col-span-4',
		placeholder: '123 Main St...'
	},
	{
		id: 'city',
		title: 'City',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'City...'
	},
	{
		id: 'state',
		title: 'State/Province',
		type: 'text',
		space: 'col-span-1',
		placeholder: 'State...'
	},
	{
		id: 'postal_code',
		title: 'Postal Code',
		type: 'text',
		space: 'col-span-1',
		placeholder: 'ZIP/Postal...'
	},
	{
		id: 'country',
		title: 'Country',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'Country...'
	},
	{
		id: 'phone_number',
		title: 'Phone Number',
		type: 'tel',
		space: 'col-span-2',
		placeholder: '(123) 456-7890'
	}
] satisfies {
	id: keyof PharmacyFlatForm;
	title: string;
	type: string;
	space: string;
	placeholder?: string;
}[];
