<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	import { AddPharmacyFlatConfig } from '$lib/config/form/addPharmacyConfig.js';
	import type { PharmacyFlatForm } from '$lib/types/PharmacyConfig.js';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import { getPharmacyContext } from '$lib/context/PharmacyContext.js';
	let { searchQuery, createPharmacyForm } = $props();
	const pharmacy = getPharmacyContext();

	const { form, errors, enhance, reset } = superForm<PharmacyFlatForm>(createPharmacyForm, {
		resetForm: false,
		dataType: 'json',
		onSubmit() {
			toast.loading('Processing...');
		},
		onResult(event) {
			toast.dismiss();
			if (event.result.type === 'success') {
				toast.success('Successfully created a Pharmacy');
				pharmacy.addPharmacy(event.result.data?.data);
				reset();
			} else if (event.result.type === 'failure') {
				toast.error('ERROR!');
			}
		}

		// ... rest of your config
	});

	$effect(() => {
		$form.name = searchQuery;
	});
</script>

<Dialog.Root>
	<Dialog.Trigger>Add Pharmacy</Dialog.Trigger>
	<Dialog.Content>
		<form action="?/createPharmacy" method="POST" use:enhance>
			<div class="grid w-full grid-cols-4 gap-x-4">
				{#each AddPharmacyFlatConfig as c}
					<div class={`${c.space}`}>
						<Label for={c.id}>{c.title}</Label>
						<Input
							id={c.id}
							name={c.id}
							type={c.type}
							placeholder={c.placeholder}
							bind:value={$form[c.id]}
						/>
						{#if $errors[c.id]}
							<p class="text-sm text-red-500">{$errors[c.id]}</p>
						{/if}
					</div>
				{/each}
			</div>

			<Dialog.Footer>
				<Button type="submit">Add Pharmacy</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
