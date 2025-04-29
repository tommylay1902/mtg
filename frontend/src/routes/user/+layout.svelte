<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { PrescriptionState } from '$lib/state/PrescriptionState.svelte.js';
	import { MedicationTypeState } from '$lib/state/MedicationTypeState.svelte.js';
	import { DoctorState } from '$lib/state/DoctorState.svelte.js';
	import { setPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { setDoctorContext } from '$lib/context/DoctorContext.js';
	import { setMedicationTypeContext } from '$lib/context/MedicationContext.js';
	let { data, children } = $props();

	// @ts-ignore
	let { supabase } = $derived(data);

	let prescriptions = new PrescriptionState(data.prescription);
	let medicationTypes = new MedicationTypeState(data.medicationTypes ?? []);
	let doctor = new DoctorState(data.doctors);

	setPrescriptionContext(prescriptions);
	setMedicationTypeContext(medicationTypes);
	setDoctorContext(doctor);

	const logout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error(error);
		} else {
			goto('/auth');
		}
	};
</script>

<header>
	<Navbar {logout} />
</header>
<main>
	{@render children()}
	<Toaster richColors />
</main>
