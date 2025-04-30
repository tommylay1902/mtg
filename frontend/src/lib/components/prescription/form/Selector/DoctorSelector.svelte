<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { getDoctorContext } from '$lib/context/DoctorContext.js';
	import type { Doctor } from '$lib/types/Doctor.js';
	import AddDoctorTypeDialog from '../../dialog/AddDoctorTypeDialog.svelte';
	import { Input } from '$lib/components/ui/input/index.js';

	const doctors = getDoctorContext();

	let { value = $bindable(), createDoctorForm } = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let searchQuery = $state('');

	// Filter doctors based on search query
	const filteredDoctors = $derived.by(() => {
		if (!searchQuery) return doctors?.current ?? [];
		return (
			doctors?.current.filter((doctor) =>
				doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase())
			) ?? []
		);
	});

	const selectedValue: Doctor | string = $derived(
		doctors?.current.find((f) => f.id === value) ?? 'Unknown'
	);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-full justify-between"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				{typeof selectedValue === 'string' ? selectedValue : `${selectedValue.lastName}`}
				<ChevronsUpDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root>
			<Input placeholder="Search by last name..." class="h-9 p-4" bind:value={searchQuery} />
			<Command.List>
				<Command.Group>
					<Command.Item
						value=""
						onSelect={() => {
							value = '';
							closeAndFocusTrigger();
						}}
					>
						<Check class={cn(value !== '' && 'text-transparent')} />
						{'Unknown'}
					</Command.Item>
					{#if filteredDoctors.length !== 0}
						{#each filteredDoctors as doctor (doctor.id)}
							<Command.Item
								value={doctor.id}
								onSelect={() => {
									value = doctor.id;
									closeAndFocusTrigger();
								}}
							>
								<Check class={cn(value !== doctor.id && 'text-transparent')} />
								{doctor.lastName}
							</Command.Item>
						{/each}
					{:else if filteredDoctors.length === 0 && searchQuery !== ''}
						<div class="text-center text-sm font-bold">No doctors found for "{searchQuery}"</div>
					{/if}
				</Command.Group>
			</Command.List>
			<AddDoctorTypeDialog {searchQuery} {createDoctorForm} isButton={true} />
		</Command.Root>
	</Popover.Content>
</Popover.Root>
