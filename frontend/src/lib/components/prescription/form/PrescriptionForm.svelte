<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { rxFormConfig } from '$lib/config/form/rxFormConfig.js';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';
	import MedicationTypeSelector from './Selector/MedicationTypeSelector.svelte';
	import type {
		PrescriptionSchemaType,
		rxFormConfigFields
	} from '$lib/config/form/rxFormConfig.js';
	import DoctorSelector from './Selector/DoctorSelector.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Pill from '@lucide/svelte/icons/pill';

	let { prescriptionForm, createMedTypeForm, isAddDialogOpen = $bindable() } = $props();
	const prescriptions = getPrescriptionContext();

	const formConfigs: Array<rxFormConfigFields> = rxFormConfig;

	const { form, errors, enhance, reset, delayed } = superForm<PrescriptionSchemaType>(
		prescriptionForm,
		{
			dataType: 'json',
			resetForm: true,
			onSubmit() {
				toast.loading('Processing...');
			},
			onResult(event) {
				toast.dismiss();
				if (event.result.type === 'success') {
					reset();
					isAddDialogOpen = false;
					prescriptions.addPrescription(event.result.data?.data);
					toast.success('Success', {
						description: 'Successfully created prescription'
					});
				} else if (event.result.type === 'failure') {
					toast.error('Something went wrong...', {
						description: 'Please fix the errors in the form before submitting.'
					});
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

<form method="POST" action="?/createPrescription" use:enhance>
	<div class="grid w-full grid-cols-4 gap-x-4">
		{#each formConfigs as config}
			{#if config.id === 'medicationType'}
				<div class={config.space + ' py-4'}>
					<MedicationTypeSelector
						{isDropdownOpen}
						bind:value={$form.medicationType}
						{createMedTypeForm}
					/>
					<div class="min-h-5">
						{#if $errors[config.id]}
							<p class="text-sm text-red-500">{unwrapError($errors[config.id])}</p>
						{/if}
					</div>
				</div>
			{:else if config.id === 'prescribedBy'}
				<div class={config.space}>
					<Label>Prescribed By</Label>
					<DoctorSelector />
				</div>
			{:else if config.id === 'notes'}
				<div class={config.space}>
					<Label for={config.id}>{config.title}</Label>
					<Textarea
						id={config.id}
						name={config.id}
						bind:value={$form[config.id]}
						placeholder={config?.placeholder}
					/>
					<div class="min-h-5">
						{#if $errors[config.id]}
							<p class="text-sm text-red-500">{$errors[config.id]}</p>
						{/if}
					</div>
				</div>
			{:else if config.type !== 'select'}
				<div class={config.space}>
					<Label for={config.id}>{config.title}</Label>
					<Input
						id={config.id}
						name={config.id}
						type={config.type}
						bind:value={$form[config.id]}
						placeholder={config?.placeholder}
					/>
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
		<Button type="submit">
			<Pill />
			<span class="text-md"> Add Prescription </span>
		</Button>
	</Dialog.Footer>
</form>
