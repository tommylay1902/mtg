<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { superForm } from 'sveltekit-superforms/client';
	import { type AddMedicationTypeSchema } from '$lib/config/form/addMedTypeFormConfig.js';
	import { toast } from 'svelte-sonner';
	import { getMedicationTypeContext } from '$lib/context/MedicationContext.js';
	import ColorPicker from 'svelte-awesome-color-picker';

	const medicationTypes = getMedicationTypeContext();

	let { searchQuery, createMedTypeForm, isButton } = $props();
	$effect(() => {
		$form.type = searchQuery;
	});

	const { form, errors, enhance, reset, delayed } = superForm<AddMedicationTypeSchema>(
		createMedTypeForm,
		{
			dataType: 'json',
			resetForm: false,
			onSubmit() {
				toast.loading('Processing...');
			},
			onResult(event) {
				toast.dismiss();
				if (event.result.type === 'success') {
					toast.success('Successfully created Medication type');

					medicationTypes.addMedicationType(event.result.data?.data);
					reset();
				} else if (event.result.type === 'failure') {
					toast.error('ERROR!');
				}
			}
		}
	);
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		{#if isButton}
			<Button class="w-full" variant="outline">Add Medication Type</Button>
		{:else}
			<Button variant="link" class="text-blue-500">Click here to add as medication type</Button>
		{/if}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Medication Type</Dialog.Title>
		</Dialog.Header>
		<form action="?/createMedType" method="POST" use:enhance>
			<div class="grid gap-4 py-4">
				<div>
					<Label for="type" class="text-right">Medication Type</Label>
					<Input id="type" bind:value={$form.type} />
				</div>
				<div>
					<ColorPicker label={'Pick a color to associate this tag with'} bind:hex={$form.color} />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Add Medication Type</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
