<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { Prescription } from '$lib/types/Prescription.js';
	import { rxFormConfig } from '$lib/config/form/rxFormConfig.js';
	import { compareDates } from '$lib/utils.js';
	import MedicationTypeSelector from '$lib/components/prescription/form/Selector/MedicationTypeSelector.svelte';
	import { type MedicationType } from '$lib/types/MedicationType.js';
	import Loader from '$lib/components/ui/Loader.svelte';
	import { toast } from 'svelte-sonner';
	import DoctorSelector from '$lib/components/prescription/form/Selector/DoctorSelector.svelte';

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

	// let selectedMedTypes = $state<MedicationType[]>([]);
	let isLoadingMedTypes = $state<boolean>(false);

	let {
		updateDisplayPrescriptions,
		isUpdateDialogOpen = $bindable(),
		rowSelection = $bindable(),
		createMedTypeForm,
		createDoctorForm
	} = $props();

	const inputConfigs = rxFormConfig;

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
		toast.loading('Updating prescriptions...');
		await fetch('/api/prescriptions', {
			method: 'PUT',
			body: JSON.stringify(localDrafts)
		});
		toast.dismiss();
		toast.success('Success!', {
			description: 'Succesfully updated prescription(s)'
		});

		prescriptions.updatePrescriptions(localDrafts);
		isUpdateDialogOpen = false;
	};

	let lastMedicationTypes = $state<MedicationType[]>([]);
	let lastDoctor = $state<string>('');

	$effect(() => {
		if (isUpdateDialogOpen) {
			const currentMed = localDrafts[activeIdx]?.medicationType || [];
			const currentDoctor = localDrafts[activeIdx]?.prescribedBy || '';
			if (!arraysEqual(currentMed, lastMedicationTypes)) {
				updateupdateIds(localDrafts[activeIdx], 'medicationType', currentMed);
				lastMedicationTypes = currentMed;
			}
			if (lastDoctor !== currentDoctor) {
				updateupdateIds(localDrafts[activeIdx], 'prescribedBy', currentDoctor);
				lastDoctor = currentDoctor;
			}
		}
	});

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
		activeDraft: Prescription,
		field: K,
		changeEvent?: Event | MedicationType[] | string
	) => {
		if (Array.isArray(changeEvent)) {
			activeDraft.medicationType = [...changeEvent];
		} else if (field && changeEvent instanceof Event) {
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
		}

		const keys = Object.keys(activeDraft) as (keyof Prescription)[];

		// if something is true it will break out of the loop because we just need to know there is one change from the activeDraft and the original object
		// else will iterate through the whole array and make sure there are no changes
		const hasUpdate = keys.some((k) => {
			if (k === 'refills') {
				return +activeDraft[k] !== +original[activeIdx][k];
			} else if (k === 'started' || k === 'ended') {
				return !compareDates(activeDraft[k], original[activeIdx][k]);
			} else if (k === 'medicationType') {
				return !arraysEqual(activeDraft.medicationType || [], original[activeIdx][k] || []);
			} else if (k === 'prescribedBy') {
				const compare = activeDraft[k] === '' ? null : activeDraft[k];
				return compare !== original[activeIdx][k];
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

	const arraysEqual = (a: MedicationType[], b: MedicationType[]) => {
		return a.length === b.length && a.every((item, i) => item.id === b[i].id);
	};

	const unwrapError = (error: { _errors?: string[] } | string | string[] | undefined): string => {
		if (!error) return '';

		// Handle Zod array error format
		if (typeof error === 'object' && '_errors' in error) {
			return error._errors?.[0] || '';
		}

		// Handle string arrays
		if (Array.isArray(error)) {
			return error[0] || '';
		}

		// Handle regular strings
		return error.toString();
	};

	let isDropdownOpen = $state(false);
</script>

<Dialog.Root bind:open={isUpdateDialogOpen}>
	<Dialog.Content class="max-h-[90dvh] max-w-[50dvw] overflow-y-scroll">
		<Dialog.Header>
			<Dialog.Title>Update Prescription</Dialog.Title>
		</Dialog.Header>

		{#if updateDisplayPrescriptions.length > 0 && activeIdx <= updateDisplayPrescriptions.length}
			<div class="grid w-full grid-cols-4 gap-x-4">
				{#each inputConfigs as config}
					{#if config.id === 'medicationType'}
						{#if isLoadingMedTypes}
							<div
								class="flex min-h-[12dvh] items-center justify-center justify-items-center gap-x-4"
							>
								<Loader />
								<div>Loading medication types...</div>
							</div>
						{:else}
							{#key activeIdx}
								<div class={`min-h-[12dvh] w-full ${config.space}`}>
									<MedicationTypeSelector
										{isDropdownOpen}
										bind:value={localDrafts[activeIdx].medicationType}
										{createMedTypeForm}
									/>
								</div>
							{/key}
						{/if}
					{:else if config.id === 'prescribedBy'}
						<div class="col-span-4 w-full py-3">
							<Label>Prescribed By</Label>
							<DoctorSelector bind:value={localDrafts[activeIdx].prescribedBy} {createDoctorForm} />
						</div>
					{:else}
						<div class={`${config.space}`}>
							<Label for={config.id}>{config.title}</Label>
							<Input
								id={config.id}
								value={config.transform(localDrafts[activeIdx][config.id])}
								oninput={(e: Event) => updateupdateIds(localDrafts[activeIdx], config.id, e)}
								type={config.type}
							/>
						</div>
					{/if}
				{/each}
				<div class="col-span-4 flex items-center justify-center">
					{activeIdx + 1} of {updateDisplayPrescriptions.length ?? 0}
				</div>
				<div class="col-span-4 mt-3 flex items-center justify-between">
					<Button onclick={() => (isUpdateDialogOpen = false)}>Cancel</Button>

					<div class="flex items-center gap-2">
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
