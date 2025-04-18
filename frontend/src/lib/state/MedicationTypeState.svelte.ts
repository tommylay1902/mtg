import type { MedicationType } from '$lib/types/MedicationType.js';

export class MedicationTypeState {
	medicationType = $state<MedicationType[]>([]);
	constructor(m: MedicationType[]) {
		this.medicationType = m;
	}
	get current() {
		return this.medicationType;
	}
	addMedicationType(m: MedicationType) {
		this.medicationType = [...this.medicationType, m];
	}
	deleteMedicationType(selectedIds: string[]) {
		this.medicationType = this.medicationType.filter((m: MedicationType) => {
			return !selectedIds.includes(m.id);
		});
	}
	updateMedicationType(updatedMedications: MedicationType[]) {
		this.medicationType = this.medicationType.map((existing) => {
			const updated = updatedMedications.find((p) => p.id === existing.id);

			return updated ? { ...existing, ...updated } : existing;
		});
	}
}
