<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { toast } from 'svelte-sonner';
	let { rowSelection = $bindable(), isDeleteDialogOpen = $bindable() } = $props();
	const prescriptions = getPrescriptionContext();

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
				isDeleteDialogOpen = false;
			} else {
				throw new Error(await response.text());
			}
		} catch (error) {
			toast.error('Failed to delete prescriptions: ' + error);
		}
	};
</script>

<Dialog.Root bind:open={isDeleteDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Confirm Deletion</Dialog.Title>
		</Dialog.Header>
		<div>Are you sure you want to remove the selected prescriptions?</div>
		<Dialog.Footer>
			<Button onclick={batchDelete}>Confirm Deletion</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
