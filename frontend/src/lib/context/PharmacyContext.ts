import { PharmacyState } from '$lib/state/PharmacyState.svelte.js';

import { getContext, setContext } from 'svelte';

const key = {};
export function setPharmacyContext(pharmacy: PharmacyState) {
	setContext(key, pharmacy);
}

export function getPharmacyContext() {
	return getContext(key) as PharmacyState;
}
