<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { addRxFormConfig } from '$lib/config/form/addRxFormConfig.js';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';
	import { type Prescription } from '$lib/types/Prescription.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { getMedicationTypeContext } from '$lib/context/MedicationContext.js';
	import MedicationType from './Selector/MedicationType.svelte';

	let { prescriptionForm, isAddDialogOpen = $bindable() } = $props();
	const prescriptions = getPrescriptionContext();
	const medicationTypes = getMedicationTypeContext();

	const formConfigs: Array<{
		id: keyof Prescription;
		title: string;
		type: string;
	}> = addRxFormConfig;

	const { form, errors, enhance, reset, delayed } = superForm<Prescription>(prescriptionForm, {
		resetForm: false,
		onSubmit() {
			toast.loading('Processing...');
		},
		onResult(event) {
			toast.dismiss();
			if (event.result.type === 'success') {
				isAddDialogOpen = false;
				prescriptions.addPrescription(event.result.data?.data);
				toast.success('Successfully created prescription');
				reset();
			} else if (event.result.type === 'failure') {
				toast.error('ERROR!');
			}
		}
	});

	let value = $state('');
	let isDropdownOpen = $state(false);

	const triggerContent = $derived(
		medicationTypes.current.find((f) => f.type === value)?.type ?? 'Select medication type'
	);
</script>

<form method="POST" use:enhance>
	<div class="flex w-full flex-col justify-center space-y-4">
		<MedicationType {isDropdownOpen} />
		{#each formConfigs as config}
			{#if config.type === 'select' && medicationTypes.current.length > 0}
				<Label for={config.id}>{config.title}</Label>
				<Select.Root type="single" bind:value>
					<Select.Trigger>{triggerContent}</Select.Trigger>
					<Select.Content>
						{#each medicationTypes.current as mt}
							<Select.Item value={mt.type}>{mt.type}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{:else}
				<div>
					<Label for={config.id}>{config.title}</Label>
					<Input id={config.id} name={config.id} type={config.type} bind:value={$form[config.id]} />
					<div class="min-h-5">
						{#if $errors[config.id]}
							<p class="text-sm text-red-500">{$errors[config.id]}</p>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	</div>

	<Dialog.Footer>
		<Button type="submit">Add Prescription</Button>
	</Dialog.Footer>
</form>
