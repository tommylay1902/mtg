import { type MedicationType } from './MedicationType.js';
export type Prescription = {
	id: string;
	medication: string;
	dosage: string;
	notes: string;
	started: string;
	ended: string;
	refills: number;
	total: number;
	prescribedBy: string;
	medicationType: MedicationType[];
};
