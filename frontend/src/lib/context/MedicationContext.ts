import { MedicationTypeState } from '$lib/state/MedicationTypeState.svelte.js';

import { getContext, setContext } from 'svelte';

const key = {};
export function setMedicationTypeContext(medicationType: MedicationTypeState) {
	setContext(key, medicationType);
}

export function getMedicationTypeContext() {
	return getContext(key) as MedicationTypeState;
}
