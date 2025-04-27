import { z } from 'zod';

export const addDoctorForm = z.object({
	firstName: z.string().min(1, 'required'),
	lastName: z.string().min(1, 'required'),
	phoneNumber: z.string().nullable(),
	notes: z.string().nullable(),
	works: z.string()
});

export type AddDoctorSchema = z.infer<typeof addDoctorForm>;

export type FormFieldKeys = keyof AddDoctorSchema;

export type addDoctorFormConfigFields = {
	id: FormFieldKeys;
	title: string;
	type: string;
	space: string;
	placeholder?: string;
	transform: (data: any) => string | null;
};

export const AddDoctorFormConfig: addDoctorFormConfigFields[] = [
	{
		id: 'firstName',
		title: 'First Name',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'Enter first name...',
		transform: (data: any) => data
	},
	{
		id: 'lastName',
		title: 'Last Name',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'enter last name...',
		transform: (data: any) => data
	},
	{
		id: 'phoneNumber',
		title: 'Phone Number',
		type: 'text',
		space: 'col-span-2',
		placeholder: 'enter phone number...',
		transform: (data: any) => data
	},
	{
		id: 'works',
		title: 'Works At',
		type: 'select',
		space: 'col-span-4',
		placeholder: 'Clinic doctor works at...',
		transform: (data: any) => data
	}
];
