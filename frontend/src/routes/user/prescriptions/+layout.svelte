<script lang="ts">
	import { PrescriptionState } from '$lib/state/PrescriptionState.svelte.js';
	import { MedicationTypeState } from '$lib/state/MedicationTypeState.svelte.js';
	import { DoctorState } from '$lib/state/DoctorState.svelte.js';
	import { setPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { setDoctorContext } from '$lib/context/DoctorContext.js';
	import { setMedicationTypeContext } from '$lib/context/MedicationContext.js';
	let { data, children } = $props();

	let prescriptions = new PrescriptionState(data.prescription);
	let medicationTypes = new MedicationTypeState(data.medicationTypes ?? []);
	let doctor = new DoctorState(data.doctors);

	setPrescriptionContext(prescriptions);
	setMedicationTypeContext(medicationTypes);
	setDoctorContext(doctor);
</script>

{@render children()}
