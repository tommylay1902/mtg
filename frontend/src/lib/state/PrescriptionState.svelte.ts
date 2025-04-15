import type { Prescription } from '$lib/components/table/prescription/Columns.js';

export class PrescriptionState {
	prescriptions = $state<Prescription[]>([]);
	constructor(p: Prescription[]) {
		this.prescriptions = p;
	}
	get current() {
		return this.prescriptions;
	}
	addPrescription(p: Prescription) {
		this.prescriptions = [...this.prescriptions, p];
	}
	deletePrescriptions(selectedIds: string[]) {
		this.prescriptions = this.prescriptions.filter((p: Prescription) => {
			return !selectedIds.includes(p.id);
		});
	}
	updatePrescriptions(updatedPrescriptions: Prescription[]) {
		this.prescriptions = this.prescriptions.map((existing) => {
			const updated = updatedPrescriptions.find((p) => p.id === existing.id);
			return updated ? { ...existing, ...updated } : existing;
		});

		console.log(this.prescriptions);
	}
}
