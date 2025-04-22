<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { addRxFormConfig } from '$lib/config/form/addRxFormConfig.js';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';
	import { getMedicationTypeContext } from '$lib/context/MedicationContext.js';
	import MedicationTypeSelector from './Selector/MedicationTypeSelector.svelte';
	import type { FormFieldKeys, PrescriptionSchemaType } from '$lib/config/form/addRxFormConfig.js';
	import * as Select from '$lib/components/ui/select/index.js';

	let { prescriptionForm, isAddDialogOpen = $bindable() } = $props();
	const prescriptions = getPrescriptionContext();
	const medicationTypes = getMedicationTypeContext();

	const formConfigs: Array<{
		id: FormFieldKeys;
		title: string;
		type: string;
	}> = addRxFormConfig;

	const { form, errors, enhance, reset, delayed } = superForm<PrescriptionSchemaType>(
		prescriptionForm,
		{
			dataType: 'json',
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
		}
	);

	let isDropdownOpen = $state(false);

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
</script>

<form method="POST" use:enhance>
	<div class="flex w-full flex-col justify-center space-y-4">
		{#each formConfigs as config}
			{#if config.id === 'medicationType'}
				<div>
					<MedicationTypeSelector {isDropdownOpen} bind:value={$form.medicationType} />
					<div class="min-h-5">
						{#if $errors[config.id]}
							<p class="text-sm text-red-500">{unwrapError($errors[config.id])}</p>
						{/if}
					</div>
				</div>
			{:else if config.id === 'prescribedBy'}
				<div>
					<Select.Root type="single">
						<Select.Trigger>Who placed the prescription order</Select.Trigger>
					</Select.Root>
				</div>
			{:else if config.type !== 'select'}
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

	<Dialog.Footer class="mt-3">
		<Button type="submit">Add Prescription</Button>
	</Dialog.Footer>
</form>
