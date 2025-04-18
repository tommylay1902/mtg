<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { Prescription } from '$lib/types/Prescription.js';
	import { prescriptinInputConfigs } from '$lib/config/inputConfig.js';
	import { compareDates } from '$lib/utils.js';

	// STATES
	// array of reference ids of all prescriptions that should be updated
	let updateIds = $state<string[]>([]);
	// the active index id to get the prescription we want to display on the dialog
	let activeIdx = $state(0);

	// represents the original prescriptions so we can compare if we need to update it or not
	let original = $state<Prescription[]>([]);
	/**
	 * represents the current state of input dialog info, used to compare to {@link original}
	 **/
	let localDrafts = $state<Prescription[]>([]);

	let {
		updateDisplayPrescriptions,
		isUpdateDialogOpen = $bindable(),
		rowSelection = $bindable()
	} = $props();

	const inputConfigs = prescriptinInputConfigs;

	const prescriptions = getPrescriptionContext();

	// EFFECT
	$effect(() => {
		//reset state of dialog on close of dialog
		if (isUpdateDialogOpen === false) {
			updateDisplayPrescriptions = [];
			updateIds = [];
			activeIdx = 0;
		} else {
			// if dialog opens repopulate original data
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

	// API CALL
	const batchUpdate = async () => {
		await fetch('/api/prescriptions', {
			method: 'PUT',
			body: JSON.stringify(localDrafts)
		});

		prescriptions.updatePrescriptions(localDrafts);
		isUpdateDialogOpen = false;
	};

	/**
	 * Manages the update tracking state when prescription fields are modified
	 *
	 * @param {Event} changeEvent - The input change event triggering the update
	 * @param {Prescription} activeDraft - The current prescription being updated on the dialog, should be referencing an item in the array of  {@link localDrafts})
	 * @param {string} field - The name of the prescription field being modified
	 *
	 * Handles:
	 * - Adding prescription ID to update tracking when fields are changed
	 * - Removing ID if changes are reverted to original values
	 * - Maintains a clean list of IDs needing server updates
	 */
	const updateupdateIds = <K extends keyof Prescription>(
		changeEvent: Event,
		activeDraft: Prescription,
		field: K
	) => {
		const target = changeEvent.target as HTMLInputElement;
		const newValue = target.value ?? '';

		if (field === 'started' || field === 'ended') {
			if (newValue == '') {
				(activeDraft as Record<keyof Prescription, any>)[field] = null;
			} else {
				(activeDraft as Record<keyof Prescription, any>)[field] = new Date(
					newValue + 'T00:00:00'
				).toISOString();
			}
		} else {
			(activeDraft as Record<keyof Prescription, any>)[field] = newValue;
		}

		const keys = Object.keys(activeDraft) as (keyof Prescription)[];

		// if something is true it will break out of the loop because we just need to know there is one change from the activeDraft and the original object
		// else will iterate through the whole array and make sure there are no changes
		const hasUpdate = keys.some((k) => {
			if (k === 'refills') {
				return +activeDraft[k] !== +original[activeIdx][k];
			} else if (k === 'started' || k === 'ended') {
				return !compareDates(activeDraft[k], original[activeIdx][k]);
			}
			return activeDraft[k] !== original[activeIdx][k];
		});

		const prescriptionSet = new Set(updateIds);
		if (hasUpdate) {
			prescriptionSet.add(activeDraft.id);
		} else {
			prescriptionSet.delete(activeDraft.id);
		}

		updateIds = Array.from(prescriptionSet);
	};
</script>

<Dialog.Root bind:open={isUpdateDialogOpen}>
	<Dialog.Trigger>
		<Button>Update Prescriptions</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update Prescription</Dialog.Title>
		</Dialog.Header>

		{#if updateDisplayPrescriptions.length > 0 && activeIdx <= updateDisplayPrescriptions.length}
			<div class="flex flex-col items-center justify-center gap-y-3">
				{#each inputConfigs as config}
					<Label for={config.id}>{config.title}</Label>
					<Input
						id={config.id}
						value={config.transform(localDrafts[activeIdx][config.id])}
						oninput={(e: Event) => updateupdateIds(e, localDrafts[activeIdx], config.id)}
						type={config.type}
					/>
				{/each}
				<div class="flex w-full justify-between gap-x-2">
					<div>
						<Button onclick={() => (isUpdateDialogOpen = false)}>Cancel</Button>
					</div>
					<div>
						<Button
							disabled={activeIdx <= 0}
							onclick={() => {
								if (activeIdx > 0) {
									activeIdx -= 1;
								}
							}}
						>
							<ChevronLeft />
						</Button>
						<Button
							onclick={() => {
								if (activeIdx < updateDisplayPrescriptions.length - 1) {
									activeIdx += 1;
								}
							}}
							disabled={activeIdx >= updateDisplayPrescriptions.length - 1}
						>
							<ChevronRight />
						</Button>
					</div>

					<Button onclick={batchUpdate} disabled={updateIds.length <= 0}>Update</Button>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
