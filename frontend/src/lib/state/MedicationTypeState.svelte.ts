import type { MedicationType } from '$lib/types/MedicationType.js';

export class MedicationTypeState {
	medicationTypes = $state<MedicationType[]>([]);
	constructor(m: MedicationType[]) {
		this.medicationTypes = m;
	}
	get current() {
		return this.medicationTypes;
	}
	addMedicationType(m: MedicationType) {
		this.medicationTypes = [...this.medicationTypes, m];
	}
	deleteMedicationType(selectedIds: string[]) {
		this.medicationTypes = this.medicationTypes.filter((m: MedicationType) => {
			return !selectedIds.includes(m.id);
		});
	}
	updateMedicationType(updatedMedications: MedicationType[]) {
		this.medicationTypes = this.medicationTypes.map((existing) => {
			const updated = updatedMedications.find((p) => p.id === existing.id);

			return updated ? { ...existing, ...updated } : existing;
		});
	}
}
