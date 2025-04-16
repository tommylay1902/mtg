<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	import type { Prescription } from '../table/Columns.js';

	let prescriptionsToUpdate = $state<string[]>([]);
	let currentDisplayIndex = $state(0);

	let {
		updateDisplayPrescriptions,
		isUpdateDialogOpen = $bindable(),
		rowSelection = $bindable()
	} = $props();

	let currentDisplayPrescription = $derived.by(() => {
		if (
			updateDisplayPrescriptions.length > 0 &&
			currentDisplayIndex <= updateDisplayPrescriptions.length - 1
		) {
			return updateDisplayPrescriptions[currentDisplayIndex];
		} else {
			return null;
		}
	});

	const prescriptions = getPrescriptionContext();

	const batchUpdate = async () => {
		const updatePrescriptions = prescriptionsToUpdate
			.map((id) => {
				return updateDisplayPrescriptions.filter((p: Prescription) => p.id === id);
			})
			.flat();

		await fetch('/api/prescriptions', {
			method: 'PUT',
			body: JSON.stringify(updatePrescriptions)
		});

		prescriptions.updatePrescriptions(updatePrescriptions);
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
		if (!prescriptionsToUpdate.includes(prescription.id)) {
			prescriptionsToUpdate = [...prescriptionsToUpdate, prescription.id];
		}
	};

	const displayUpdatePrescription = async () => {
		const selectedPrescriptions: Prescription[] = Object.keys(rowSelection)
			.map((id) => {
				const original = prescriptions.current.find((p) => p.id === id);
				return original ? { ...original } : null;
			})
			.filter((p): p is Prescription => p !== null);

		updateDisplayPrescriptions = selectedPrescriptions === undefined ? [] : selectedPrescriptions;
	};

	function formatISODateForHtmlInput(isoString: string) {
		const dateValue = isoString.split('T')[0];
		return dateValue;
	}

	$effect(() => {
		if (isUpdateDialogOpen === false) {
			updateDisplayPrescriptions = [];
			prescriptionsToUpdate = [];
			currentDisplayIndex = 0;
		}
	});
</script>

<Dialog.Root bind:open={isUpdateDialogOpen}>
	<Dialog.Trigger>
		<Button onclick={displayUpdatePrescription}>Update Prescriptions</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update Prescription</Dialog.Title>
		</Dialog.Header>

		{#if updateDisplayPrescriptions.length > 0 && currentDisplayIndex <= updateDisplayPrescriptions.length}
			<div class="flex flex-col items-center justify-center gap-y-3">
				<Label for="medication">Medication</Label>
				<Input
					id="medication"
					value={currentDisplayPrescription.medication}
					oninput={(e: Event) =>
						updatePrescriptionsToUpdate(e, currentDisplayPrescription, 'medication')}
				/>
				<Label for="dosage">Dosage</Label>
				<Input
					id="dosage"
					value={currentDisplayPrescription.dosage}
					oninput={(e: Event) =>
						updatePrescriptionsToUpdate(e, currentDisplayPrescription, 'dosage')}
				/>
				<Label for="notes">Notes</Label>
				<Input
					id="notes"
					value={currentDisplayPrescription.notes}
					oninput={(e: Event) =>
						updatePrescriptionsToUpdate(e, currentDisplayPrescription, 'notes')}
				/>
				<Label for="started">Started</Label>
				<Input
					id="started"
					type="date"
					value={formatISODateForHtmlInput(currentDisplayPrescription.started)}
					oninput={(e: Event) =>
						updatePrescriptionsToUpdate(e, currentDisplayPrescription, 'started')}
				/>
				<Label for="ended">Ended</Label>
				<Input
					id="ended"
					type="date"
					value={currentDisplayPrescription.ended == null
						? ''
						: formatISODateForHtmlInput(currentDisplayPrescription.ended)}
					oninput={(e: Event) =>
						updatePrescriptionsToUpdate(e, currentDisplayPrescription, 'ended')}
				/>
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

					<Button onclick={batchUpdate} disabled={prescriptionsToUpdate.length <= 0}
						>Update Prescriptions</Button
					>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
