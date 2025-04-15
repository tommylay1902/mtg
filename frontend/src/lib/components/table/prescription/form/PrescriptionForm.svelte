<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';

	let { prescriptionForm, isDialogOpen = $bindable() } = $props();

	let toastId: string | number | undefined;

	const prescriptions = getContext<any>('prescriptions');

	const { form, errors, enhance, reset, delayed } = superForm(prescriptionForm, {
		resetForm: false,
		onSubmit() {
			toastId = toast.loading('Processing...');
		},
		onResult(event) {
			if (toastId) toast.dismiss(toastId);
			if (event.result.type === 'success') {
				isDialogOpen = false;
				prescriptions.addPrescription(event.result.data?.data);
				toast.success('Successfully created prescription');
				reset();
			} else if (event.result.type === 'failure') {
				if (toastId) toast.dismiss(toastId);
				toast.error('ERROR!');
			}
		}
	});
</script>

<form method="POST" use:enhance>
	<div class="flex w-full space-x-4">
		<div class="w-full space-y-2">
			<Label for="medication" class={$errors.medication ? 'text-red-500' : ''}>Medication</Label>
			<Input
				id="medication"
				name="medication"
				bind:value={$form.medication}
				aria-invalid={$form.medication ? 'true' : undefined}
				class={$errors.medication ? 'border-red-500' : ''}
			/>
			<div class="min-h-5">
				{#if $errors.medication}
					<p class="text-sm text-red-500">{$errors.medication}</p>
				{/if}
			</div>
		</div>
		<div class="w-full space-y-2">
			<Label for="dosage" class={$errors.dosage ? 'text-red-500' : ''}>Dosage</Label>
			<Input
				id="dosage"
				name="dosage"
				bind:value={$form.dosage}
				aria-invalid={$form.dosage ? 'true' : undefined}
				class={$errors.dosage ? 'border-red-500' : ''}
			/>
			<div class="min-h-5">
				{#if $errors.dosage}
					<p class="text-sm text-red-500">{$errors.dosage}</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex w-full space-x-4">
		<div class="w-full space-y-2">
			<Label for="notes" class={$errors.notes ? 'text-red-500' : ''}>Notes</Label>
			<Input
				id="notes"
				name="notes"
				bind:value={$form.notes}
				aria-invalid={$form.notes ? 'true' : undefined}
				class={$errors.notes ? 'border-red-500' : ''}
			/>
			<div class="min-h-5">
				{#if $errors.notes}
					<p class="text-sm text-red-500">{$errors.notes}</p>
				{/if}
			</div>
		</div>
		<div class="w-full space-y-2">
			<Label for="refills" class={$errors.refills ? 'text-red-500' : ''}>Refills</Label>
			<Input
				id="refills"
				name="refills"
				bind:value={$form.refills}
				aria-invalid={$form.refills ? 'true' : undefined}
				class={$errors.refills ? 'border-red-500' : ''}
			/>
			<div class="min-h-5">
				{#if $errors.refills}
					<p class="text-sm text-red-500">{$errors.refills}</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex w-full space-x-4">
		<div class="w-full space-y-2">
			<Label for="started" class={$errors.started ? 'text-red-500' : ''}>Started</Label>
			<Input
				id="started"
				type="date"
				name="started"
				bind:value={$form.started}
				aria-invalid={$form.started ? 'true' : undefined}
				class={$errors.started ? 'border-red-500' : ''}
			/>
			<div class="min-h-5">
				{#if $errors.started}
					<p class="text-sm text-red-500">{$errors.started}</p>
				{/if}
			</div>
		</div>
		<div class="w-full space-y-2">
			<Label for="ended" class={$errors.ended ? 'text-red-500' : ''}>Ended</Label>
			<Input
				id="ended"
				type="date"
				name="ended"
				bind:value={$form.ended}
				aria-invalid={$form.ended ? 'true' : undefined}
				class={$errors.ended ? 'border-red-500' : ''}
			/>
			<div class="min-h-5">
				{#if $errors.ended}
					<p class="text-sm text-red-500">{$errors.ended}</p>
				{/if}
			</div>
		</div>
	</div>

	<Dialog.Footer>
		<Button type="submit">Add Prescription</Button>
	</Dialog.Footer>
</form>
