<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	let { data } = $props();
	import DataTable from '$lib/components/table/prescription/PrescriptionTable.svelte';
	import { columns, type Prescription } from '$lib/components/table/prescription/Columns.js';
	import { setContext } from 'svelte';
	import PrescriptionForm from '$lib/components/table/prescription/form/PrescriptionForm.svelte';

	let prescriptions = $state(data.prescription);
	let isDialogOpen = $state(false);

	setContext('prescriptions', {
		get current() {
			return prescriptions;
		},
		addPrescription(p: Prescription) {
			prescriptions = [...prescriptions, p];
		}
	});

	// $effect(() => {
	// 	if ($errors && Object.keys($errors).length > 0) {
	// 		toast.error('There are some issues creating your prescription');
	// 	}
	// });
</script>

<div class="w-full">
	<Dialog.Root bind:open={isDialogOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Add Prescription</Dialog.Trigger>
		<Dialog.Content class="h-[67dvh] w-full max-w-[70dvw] overflow-y-scroll">
			<Dialog.Header>
				<Dialog.Title>Create a new prescription</Dialog.Title>
			</Dialog.Header>
			<PrescriptionForm prescriptionForm={data.prescriptionForm} bind:isDialogOpen />
		</Dialog.Content>
	</Dialog.Root>
	<DataTable {columns} />
</div>
