<script lang="ts">
	let { data } = $props();
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	let prescriptions = $state(data.prescription);
	const { form, errors, enhance, message, constraints } = superForm(data.prescriptionForm, {
		resetForm: true
	});
</script>

<div>
	<h1>Prescriptions</h1>
	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Add Prescription</Dialog.Trigger>
		<Dialog.Content class="h-[90dvh] overflow-y-scroll">
			<Dialog.Header>
				<Dialog.Title>Create a new prescription</Dialog.Title>
			</Dialog.Header>
			<div>
				<form method="POST" use:enhance>
					<div class="space-y-2">
						<Label for="medication" class={$errors.medication ? 'text-red-500' : ''}
							>Medication</Label
						>
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
					<div class="space-y-2">
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
					<div class="space-y-2">
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
					<div class="space-y-2">
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
					<div class="space-y-2">
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
					<div class="space-y-2">
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
					<Dialog.Footer>
						<Button type="submit">Add Prescription</Button>
					</Dialog.Footer>
				</form>
			</div>
		</Dialog.Content>
	</Dialog.Root>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Medication</Table.Head>
				<Table.Head>Dosage</Table.Head>
				<Table.Head>Notes</Table.Head>
				<Table.Head>Started</Table.Head>
				<Table.Head>Ended</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each prescriptions as prescription}
				<Table.Row>
					<Table.Cell>
						{prescription.medication}
					</Table.Cell>
					<Table.Cell>
						{prescription.dosage}
					</Table.Cell>
					<Table.Cell>
						{prescription.notes}
					</Table.Cell>
					<Table.Cell>
						{new Date(
							prescription.started.substring(0, prescription.started.length - 1)
						).toLocaleDateString()}
					</Table.Cell>
					<Table.Cell>
						{new Date(
							prescription.ended.substring(0, prescription.ended.length - 1)
						).toLocaleDateString()}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
