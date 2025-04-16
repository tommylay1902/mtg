<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { Prescription } from '../table/Columns.js';
	import { prescriptinInputConfigs } from '$lib/config/inputConfig.js';

	let prescriptionsToUpdate = $state<string[]>([]);
	let currentDisplayIndex = $state(0);

	let {
		updateDisplayPrescriptions,
		isUpdateDialogOpen = $bindable(),
		rowSelection = $bindable()
	} = $props();

	let original = $state<Prescription[]>([]);
	let localDrafts = $state<Prescription[]>([]);

	const inputConfigs = prescriptinInputConfigs;

	const prescriptions = getPrescriptionContext();

	const batchUpdate = async () => {
		await fetch('/api/prescriptions', {
			method: 'PUT',
			body: JSON.stringify(localDrafts)
		});

		prescriptions.updatePrescriptions(localDrafts);
		isUpdateDialogOpen = false;
	};

	const updatePrescriptionsToUpdate = <K extends keyof Prescription>(
		e: Event,
		prescription: Prescription,
		field: K
	) => {
		const target = e.target as HTMLInputElement;
		const newValue = target.value ?? '';

		if (field === 'started' || field === 'ended') {
			if (newValue == '') {
				(prescription as Record<keyof Prescription, any>)[field] = null;
			} else {
				(prescription as Record<keyof Prescription, any>)[field] = new Date(
					newValue + 'T00:00:00'
				).toISOString();
			}
		} else {
			(prescription as Record<keyof Prescription, any>)[field] = newValue;
		}

		const keys = Object.keys(prescription) as (keyof Prescription)[];
		let hasUpdate = false;

		keys.forEach((k) => {
			if (k === 'refills') {
				if (+prescription[k] !== +original[currentDisplayIndex][k]) {
					hasUpdate = true;
				}
			} else if (k === 'started' || k === 'ended') {
				const newDate = prescription[k];
				const oldDate = original[currentDisplayIndex][k];
				if (newDate == null || oldDate == null) {
					if (newDate !== oldDate) hasUpdate = true;
				} else if (newDate.split('T')[0] !== oldDate.split('T')[0]) {
					hasUpdate = true;
				}
			} else if (prescription[k] !== original[currentDisplayIndex][k]) {
				hasUpdate = true;
			}
		});

		if (!hasUpdate) {
			if (prescriptionsToUpdate.includes(prescription.id)) {
				prescriptionsToUpdate = prescriptionsToUpdate.filter((id) => id !== prescription.id);
			}
		} else {
			if (!prescriptionsToUpdate.includes(prescription.id)) {
				prescriptionsToUpdate = [...prescriptionsToUpdate, prescription.id];
			}
		}
	};

	$effect(() => {
		if (isUpdateDialogOpen === false) {
			updateDisplayPrescriptions = [];
			prescriptionsToUpdate = [];
			currentDisplayIndex = 0;
		} else {
			const selectedPrescriptions: Prescription[] = Object.keys(rowSelection)
				.map((id) => {
					const original = prescriptions.current.find((p) => p.id === id);
					return original ? JSON.parse(JSON.stringify(original)) : null;
				})
				.filter((p): p is Prescription => p !== null);

			updateDisplayPrescriptions = selectedPrescriptions;
			original = structuredClone(selectedPrescriptions);
			localDrafts = structuredClone(selectedPrescriptions);
		}
	});
</script>

<Dialog.Root bind:open={isUpdateDialogOpen}>
	<Dialog.Trigger>
		<Button>Update Prescriptions</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update Prescription</Dialog.Title>
		</Dialog.Header>

		{#if updateDisplayPrescriptions.length > 0 && currentDisplayIndex <= updateDisplayPrescriptions.length}
			<div class="flex flex-col items-center justify-center gap-y-3">
				{#each inputConfigs as config}
					<Label for={config.id}>{config.title}</Label>
					<Input
						id={config.id}
						value={config.transform(localDrafts[currentDisplayIndex][config.id])}
						oninput={(e: Event) =>
							updatePrescriptionsToUpdate(e, localDrafts[currentDisplayIndex], config.id)}
						type={config.type}
					/>
				{/each}
				<div class="flex w-full justify-between gap-x-2">
					<div>
						<Button onclick={isUpdateDialogOpen}>Cancel</Button>
					</div>
					<div>
						<Button
							disabled={currentDisplayIndex <= 0}
							onclick={() => {
								if (currentDisplayIndex > 0) {
									currentDisplayIndex -= 1;
								}
							}}
						>
							<ChevronLeft />
						</Button>
						<Button
							onclick={() => {
								if (currentDisplayIndex < updateDisplayPrescriptions.length - 1) {
									currentDisplayIndex += 1;
								}
							}}
							disabled={currentDisplayIndex >= updateDisplayPrescriptions.length - 1}
						>
							<ChevronRight />
						</Button>
					</div>

					<Button onclick={batchUpdate} disabled={prescriptionsToUpdate.length <= 0}>Update</Button>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
