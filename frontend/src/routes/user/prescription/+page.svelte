<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	let { data } = $props();
	import DataTable from '$lib/components/table/prescription/PrescriptionTable.svelte';
	import PrescriptionForm from '$lib/components/table/prescription/form/PrescriptionForm.svelte';

	import type { RowSelectionState } from '@tanstack/react-table';
	import { toast } from 'svelte-sonner';
	import { setPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { PrescriptionState } from '$lib/state/PrescriptionState.svelte.js';

	let toastId: string | number | undefined;
	let rowSelection = $state<RowSelectionState>({});

	let isDialogOpen = $state(false);
	let displayDeleteButton = $state(false);
	let prescriptions = new PrescriptionState(data.prescription);
	setPrescriptionContext(prescriptions);

	$effect(() => {
		if (Object.keys(rowSelection).length > 0) {
			displayDeleteButton = true;
		} else {
			displayDeleteButton = false;
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
				toast.success('Successfully deleted prescriptions');
				// Refresh the data
				prescriptions.deletePrescriptions(selectedIds);
				rowSelection = {}; // Clear selection
			} else {
				throw new Error(await response.text());
			}
		} catch (error) {
			toast.error('Failed to delete prescriptions: ' + error);
			console.error('Delete error:', error);
		} finally {
			toast.dismiss();
		}
	};
</script>

<div class="w-full">
	{#if displayDeleteButton}
		<Button onclick={batchDelete}>Remove Prescriptions</Button>
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
