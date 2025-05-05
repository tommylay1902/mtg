<script lang="ts">
	import { PrescriptionState } from '$lib/state/PrescriptionState.svelte.js';
	import { MedicationTypeState } from '$lib/state/MedicationTypeState.svelte.js';
	import { DoctorState } from '$lib/state/DoctorState.svelte.js';
	import { setPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { setDoctorContext } from '$lib/context/DoctorContext.js';
	import { setMedicationTypeContext } from '$lib/context/MedicationContext.js';
	import { PharmacyState } from '$lib/state/PharmacyState.svelte.js';
	import { setPharmacyContext } from '$lib/context/PharmacyContext.js';
	import { onNavigate } from '$app/navigation';
	let { data, children } = $props();

	const prescriptions = new PrescriptionState(data.prescription);
	const medicationTypes = new MedicationTypeState(data.medicationTypes ?? []);
	const doctor = new DoctorState(data.doctors);
	const pharmacy = new PharmacyState(data.pharmacy);

	setPrescriptionContext(prescriptions);
	setMedicationTypeContext(medicationTypes);
	setDoctorContext(doctor);
	setPharmacyContext(pharmacy);
</script>

{@render children()}
