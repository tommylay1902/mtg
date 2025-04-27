<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';

	import {
		AddDoctorFormConfig,
		type AddDoctorSchema
	} from '$lib/config/form/addDoctorFormConfig.js';

	let { searchQuery, createDoctorForm, isButton } = $props();
	$effect(() => {
		$form.lastName = searchQuery;
	});

	const { form, errors, enhance, reset, delayed } = superForm<AddDoctorSchema>(createDoctorForm, {
		dataType: 'json',
		resetForm: false,
		onSubmit() {
			toast.loading('Processing...');
		},
		onResult(event) {
			toast.dismiss();
			if (event.result.type === 'success') {
				toast.success('Successfully created a Doctor');

				reset();
			} else if (event.result.type === 'failure') {
				toast.error('ERROR!');
			}
		}
	});
	const config = AddDoctorFormConfig;
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{#if isButton}
			<Button variant="outline" class="w-full">Add Doctor</Button>
		{:else}
			<Button variant="link" class="text-blue-500">Click here to add a new doctor</Button>
		{/if}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add a new doctor into the system</Dialog.Title>
		</Dialog.Header>
		<form action="?/createMedType" method="POST" use:enhance>
			<div class="grid w-full grid-cols-4 gap-x-4">
				{#each config as c}
					{#if c.type !== 'select'}
						<div class={`${c.space}`}>
							<Label>{c.title}</Label>
							<Input type={c.type} id={c.id} placeholder={c.placeholder} class={`${c.space}`} />
						</div>
					{/if}
				{/each}
			</div>
			<Dialog.Footer>
				<Button type="submit">Add New Doctor</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
