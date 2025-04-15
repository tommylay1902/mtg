<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import DataTable from '$lib/components/table/prescription/PrescriptionTable.svelte';
	import PrescriptionForm from '$lib/components/table/prescription/form/PrescriptionForm.svelte';
	import type { RowSelectionState } from '@tanstack/react-table';
	import { toast } from 'svelte-sonner';
	import { setPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { PrescriptionState } from '$lib/state/PrescriptionState.svelte.js';
	import { type Prescription } from '$lib/components/table/prescription/Columns.js';
	import Input from '$lib/components/ui/input/input.svelte';

	let { data } = $props();
	let rowSelection = $state<RowSelectionState>({});
	let isDialogOpen = $state(false);
	let displayDeleteButton = $state(false);
	let displayUpdateButton = $state(false);
	let isUpdateDialogOpen = $state(false);
	let updateDisplayPrescriptions = $state<Prescription[]>([]);
	let prescriptionsToUpdate = $state<string[]>([]);
	let currentDisplayIndex = $state(0);

	let prescriptions = new PrescriptionState(data.prescription);

	setPrescriptionContext(prescriptions);

	$effect(() => {
		if (Object.keys(rowSelection).length > 0) {
			displayDeleteButton = true;
			displayUpdateButton = true;
		} else {
			displayDeleteButton = false;
			displayUpdateButton = false;
		}
	});

	const batchDelete = async () => {
		const selectedIds = Object.keys(rowSelection).map((id) => {
			return id;
		});

		if (selectedIds.length === 0) {
			toast.error('Please select at least one prescription to delete');
			return;
		}

		try {
			toast.loading('Deleting selected prescriptions...');

			const response = await fetch('/api/prescriptions', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ids: selectedIds })
			});

			if (response.ok) {
				toast.dismiss();
				toast.success('Successfully deleted prescriptions');
				prescriptions.deletePrescriptions(selectedIds);
				rowSelection = {};
			} else {
				throw new Error(await response.text());
			}
		} catch (error) {
			toast.error('Failed to delete prescriptions: ' + error);
			console.error('Delete error:', error);
		}
	};

	const displayUpdatePrescription = async () => {
		const selectedPrescriptions: Prescription[] = Object.keys(rowSelection)
			.map((id) => prescriptions.current.find((p) => p.id === id))
			.filter((p): p is Prescription => p !== undefined);

		updateDisplayPrescriptions = selectedPrescriptions === undefined ? [] : selectedPrescriptions;
	};

	const updatePrescriptionsToUpdate = <K extends keyof Prescription>(
		e: Event,
		prescription: Prescription,
		field: K
	) => {
		const target = e.target as HTMLInputElement;
		const newValue = target.value ?? '';

		(prescription as Record<keyof Prescription, any>)[field] = newValue;

		if (!prescriptionsToUpdate.includes(prescription.id)) {
			prescriptionsToUpdate = [...prescriptionsToUpdate, prescription.id];
		}
	};

	const batchUpdate = async () => {
		const updatePrescriptions = prescriptionsToUpdate
			.map((id) => {
				return updateDisplayPrescriptions.filter((p) => p.id === id);
			})
			.flat();

		await fetch('/api/prescriptions', {
			method: 'PUT',
			body: JSON.stringify(updatePrescriptions)
		});

		prescriptions.updatePrescriptions(updatePrescriptions);
		isUpdateDialogOpen = false;
	};
</script>

<div class="w-full">
	{#if displayDeleteButton}
		<Button onclick={batchDelete}>Remove Prescriptions</Button>
	{/if}

	{#if displayUpdateButton}
		<Dialog.Root bind:open={isUpdateDialogOpen}>
			<Dialog.Trigger
				><Button onclick={displayUpdatePrescription}>Update Prescriptions</Button></Dialog.Trigger
			>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Update Prescription</Dialog.Title>
				</Dialog.Header>

				{#if updateDisplayPrescriptions.length > 0 && currentDisplayIndex < updateDisplayPrescriptions.length}
					<div class="flex flex-col items-center justify-center gap-y-3">
						<Input
							value={updateDisplayPrescriptions[currentDisplayIndex].medication}
							oninput={(e: Event) =>
								updatePrescriptionsToUpdate(
									e,
									updateDisplayPrescriptions[currentDisplayIndex],
									'medication'
								)}
						/>
						<Button onclick={batchUpdate}>Update Prescriptions</Button>
					</div>
				{/if}
			</Dialog.Content>
		</Dialog.Root>
	{/if}
	<Dialog.Root bind:open={isDialogOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Add Prescription</Dialog.Trigger>
		<Dialog.Content class="h-[67dvh] w-full max-w-[70dvw] overflow-y-scroll">
			<Dialog.Header>
				<Dialog.Title>Create a new prescription</Dialog.Title>
			</Dialog.Header>
			<PrescriptionForm prescriptionForm={data.prescriptionForm} bind:isDialogOpen />
		</Dialog.Content>
	</Dialog.Root>
	<DataTable bind:rowSelection />
</div>
