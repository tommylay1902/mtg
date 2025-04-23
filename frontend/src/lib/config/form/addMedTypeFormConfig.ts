import { z } from 'zod';

export const addMedicationTypeSchema = z.object({
	type: z.string(),
	color: z.string()
});

export type AddMedicationTypeSchema = z.infer<typeof addMedicationTypeSchema>;
