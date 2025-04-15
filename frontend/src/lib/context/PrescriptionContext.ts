import type { PrescriptionState } from '$lib/state/PrescriptionState.js';

import { getContext, setContext } from 'svelte';

const key = {};
export function setPrescriptionContext(prescription: PrescriptionState) {
	setContext(key, prescription);
}

export function getPrescriptionContext() {
	return getContext(key) as PrescriptionState;
}
