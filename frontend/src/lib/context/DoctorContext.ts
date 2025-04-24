import { type DoctorState } from '$lib/state/DoctorState.svelte.js';

import { getContext, setContext } from 'svelte';

const key = {};
export function setDoctorContext(doctor: DoctorState) {
	setContext(key, doctor);
}

export function getDoctorContext() {
	return getContext(key) as DoctorState;
}
