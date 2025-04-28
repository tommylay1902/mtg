import { z } from 'zod';

export const addMedicationTypeSchema = z.object({
	type: z.string().min(1, 'Need to specify a tag name/type'),
	color: z.string()
});

export type AddMedicationTypeSchema = z.infer<typeof addMedicationTypeSchema>;
