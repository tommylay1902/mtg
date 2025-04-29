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

	const {
		form: drForm,
		errors: drErrors,
		enhance: drEnhance,
		reset: drReset
	} = superForm<AddDoctorSchema>(createDoctorForm, {
		resetForm: false,
		warnings: {
			duplicateId: true
		},
		onSubmit() {
			toast.loading('Processing...');
		},
		onResult(event) {
			toast.dismiss();
			if (event.result.type === 'success') {
				toast.success('Successfully created a Doctor');
				drReset();
			} else if (event.result.type === 'failure') {
				toast.error('ERROR!');
			}
		}
	});

	$effect(() => {
		$drForm.lastName = searchQuery;
	});

	const config = AddDoctorFormConfig;
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{#if isButton}
			<Button variant="outline" class="w-full">Quick Add Doctor</Button>
		{/if}
	</Dialog.Trigger>
	<Dialog.Content class="min-w-[80dvw]">
		<Dialog.Header>
			<Dialog.Title>Add a new doctor into the system</Dialog.Title>
		</Dialog.Header>
		<form action="?/createDoctor" method="POST" use:drEnhance>
			<div class="grid w-full grid-cols-4 gap-x-4">
				{#each config as c}
					{#if c.type !== 'select'}
						<div class={`${c.space}`}>
							<Label for={c.id}>{c.title}</Label>
							<Input
								id={c.id}
								type={c.type}
								placeholder={c.placeholder}
								class={`${c.space}`}
								bind:value={$drForm[c.id]}
							/>
						</div>
					{/if}
				{/each}
			</div>
			<Dialog.Footer>
				<Button type="submit" class="pt-2">Add New Doctor</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
