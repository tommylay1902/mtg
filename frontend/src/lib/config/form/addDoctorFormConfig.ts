import { z } from 'zod';

export const quickAddDoctorFormSchema = z.object({
	firstName: z.string().min(1, 'required'),
	lastName: z.string().min(1, 'required')
});

export const extensiveAddDoctorForm = quickAddDoctorFormSchema.extend({
	phoneNumber: z.string().nullable(),
	notes: z.string().nullable(),
	works: z
		.string()
		.nullable()
		.optional()
		.transform((data) => {
			if (data === '') {
				return null;
			}
			return data;
		})
});

export type quickAddDoctorForm = z.infer<typeof quickAddDoctorFormSchema>;

export type FormFieldKeys = keyof quickAddDoctorForm;

export type quickAddDoctorFormConfigFields = {
	id: FormFieldKeys;
	title: string;
	type: string;
	space: string;
	placeholder?: string;
	transform: (data: any) => string | null;
};

export const AddDoctorFormConfig: quickAddDoctorFormConfigFields[] = [
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
		placeholder: 'Enter last name...',
		transform: (data: any) => data
	}
];

// {
// 	id: 'phoneNumber',
// 	title: 'Phone Number',
// 	type: 'text',
// 	space: 'col-span-4',
// 	placeholder: 'Enter phone number...',
// 	transform: (data: any) => data
// },
// {
// 	id: 'works',
// 	title: 'Works At',
// 	type: 'select',
// 	space: 'col-span-4',
// 	placeholder: 'Clinic doctor works at...',
// 	transform: (data: any) => data
// }
