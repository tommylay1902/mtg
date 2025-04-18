export type Prescription = {
	id: string;
	medication: string;
	dosage: string;
	notes: string;
	started: string;
	ended: string;
	refills: number;
	total: number;
	medicationType: string;
};
