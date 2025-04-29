<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import PrescriptionForm from '$lib/components/prescription/form/PrescriptionForm.svelte';
	import type { RowSelectionState } from '@tanstack/react-table';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { type Prescription } from '$lib/types/Prescription.js';
	import PrescriptionTable from '$lib/components/prescription/table/PrescriptionTable.svelte';
	import UpdatePrescriptionDialog from '$lib/components/prescription/dialog/UpdatePrescriptionDialog.svelte';
	import DeletePrescriptionDialog from '$lib/components/prescription/dialog/DeletePrescriptionDialog.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Trash from '@lucide/svelte/icons/trash';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Refresh from '@lucide/svelte/icons/refresh-cw';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import EditDock from '$lib/components/prescription/edit-dock.svelte';

	let { data } = $props();
	let rowSelection = $state<RowSelectionState>({});
	let isDeleteDialogOpen = $state(false);
	let displayEditButtons = $state(false);

	let isUpdateDialogOpen = $state(false);
	let isAddDialogOpen = $state(false);
	let updateDisplayPrescriptions = $state<Prescription[]>([]);

	let filterStatus = $state('active');

	const prescriptions = getPrescriptionContext();

	$effect(() => {
		if (Object.keys(rowSelection).length > 0) {
			displayEditButtons = true;
		} else {
			displayEditButtons = false;
		}
	});
</script>

<div class="w-full">
	<div class="flex justify-between px-4 pb-3">
		<div class="flex flex-row">
			<h1 class="text-2xl font-bold">Prescriptions</h1>
			<Badge class="py-0 font-bold" variant="secondary"
				>{prescriptions.current.length ?? 0} Total</Badge
			>
		</div>

		<Tabs.Root bind:value={filterStatus} class="w-[400px]">
			<Tabs.List class="grid w-full grid-cols-3">
				<Tabs.Trigger value="past" tabindex={0}>
					{#if filterStatus === 'past'}
						<span class="animate-pulsewave rounded-full bg-yellow-600 p-1"></span>
					{/if}
					<span class="pl-1">Taken</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="active" tabindex={0}>
					{#if filterStatus === 'active'}
						<span class="animate-pulsewave rounded-full bg-green-700 p-1"></span>
					{/if}
					<span class="pl-1">Need To Take</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="all" tabindex={0}>
					{#if filterStatus === 'all'}
						<span class="animate-pulsewave rounded-full bg-blue-700 p-1"></span>
					{/if}
					<span class="pl-1">All Today</span>
				</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>

		<Dialog.Root bind:open={isAddDialogOpen}>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
				>Add Prescription</Dialog.Trigger
			>
			<Dialog.Content class="h-[85dvh] w-full max-w-[50dvw] overflow-y-scroll rounded-2xl">
				<Dialog.Header>
					<Dialog.Title class="text-center text-2xl">Create a new prescription</Dialog.Title>
				</Dialog.Header>
				<PrescriptionForm
					createDoctorForm={data.form?.createDoctorForm}
					prescriptionForm={data.form?.prescriptionForm}
					createMedTypeForm={data.form?.createMedTypeForm}
					bind:isAddDialogOpen
				/>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<PrescriptionTable bind:rowSelection />

	{#if displayEditButtons}
		<EditDock bind:isDeleteDialogOpen bind:isUpdateDialogOpen />

		<DeletePrescriptionDialog bind:rowSelection bind:isDeleteDialogOpen />
		<UpdatePrescriptionDialog
			bind:isUpdateDialogOpen
			{updateDisplayPrescriptions}
			createMedTypeForm={data.form?.createMedTypeForm}
			bind:rowSelection
			createDoctorForm={data.form?.createDoctorForm}
		/>
	{/if}
</div>
