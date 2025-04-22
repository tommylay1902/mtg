<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import PrescriptionForm from '$lib/components/prescription/form/PrescriptionForm.svelte';
	import type { RowSelectionState } from '@tanstack/react-table';
	import { setPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { PrescriptionState } from '$lib/state/PrescriptionState.svelte.js';
	import { type Prescription } from '$lib/types/Prescription.js';
	import PrescriptionTable from '$lib/components/prescription/table/PrescriptionTable.svelte';
	import UpdatePrescriptionDialog from '$lib/components/prescription/dialog/UpdatePrescriptionDialog.svelte';
	import DeletePrescriptionDialog from '$lib/components/prescription/dialog/DeletePrescriptionDialog.svelte';
	import { MedicationTypeState } from '$lib/state/MedicationTypeState.svelte.js';
	import { setMedicationTypeContext } from '$lib/context/MedicationContext.js';

	let { data } = $props();
	let rowSelection = $state<RowSelectionState>({});
	let isDeleteDialogOpen = $state(false);
	let displayDeleteButton = $state(false);
	let displayUpdateButton = $state(false);
	let isUpdateDialogOpen = $state(false);
	let isAddDialogOpen = $state(false);
	let updateDisplayPrescriptions = $state<Prescription[]>([]);

	let prescriptions = new PrescriptionState(data.prescription);
	let medicationTypes = new MedicationTypeState(data.medicationTypes);

	setPrescriptionContext(prescriptions);
	setMedicationTypeContext(medicationTypes);

	$effect(() => {
		if (Object.keys(rowSelection).length > 0) {
			displayDeleteButton = true;
			displayUpdateButton = true;
		} else {
			displayDeleteButton = false;
			displayUpdateButton = false;
		}
	});
</script>

<div class="w-full">
	{#if displayDeleteButton}
		<Button
			onclick={() => {
				isDeleteDialogOpen = true;
			}}>Remove Prescriptions</Button
		>
		<DeletePrescriptionDialog bind:rowSelection bind:isDeleteDialogOpen />
	{/if}

	{#if displayUpdateButton}
		<UpdatePrescriptionDialog
			bind:isUpdateDialogOpen
			{updateDisplayPrescriptions}
			createMedTypeForm={data.form?.createMedTypeForm}
			bind:rowSelection
		/>
	{/if}
	<Dialog.Root bind:open={isAddDialogOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Add Prescription</Dialog.Trigger>
		<Dialog.Content class="h-[67dvh] w-full max-w-[70dvw] overflow-y-scroll">
			<Dialog.Header>
				<Dialog.Title>Create a new prescription</Dialog.Title>
			</Dialog.Header>
			<PrescriptionForm
				prescriptionForm={data.form?.prescriptionForm}
				createMedTypeForm={data.form?.createMedTypeForm}
				bind:isAddDialogOpen
			/>
		</Dialog.Content>
	</Dialog.Root>
	<PrescriptionTable bind:rowSelection />
</div>
