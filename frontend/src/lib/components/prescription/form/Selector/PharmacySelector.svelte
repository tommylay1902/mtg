<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { Pharmacy } from '$lib/types/Pharmacy.js';

	import AddPharmacyDialog from '../../dialog/AddPharmacyDialog.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { getPharmacyContext } from '$lib/context/PharmacyContext.js';

	const pharmacy = getPharmacyContext();

	let { value = $bindable(), createPharmacyForm } = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let searchQuery = $state('');

	// Filter doctors based on search query
	const filteredPharmacy = $derived.by(() => {
		if (!searchQuery) return pharmacy?.current ?? [];

		return pharmacy?.current.filter(
			(p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? []
		);
	});

	const selectedValue: Pharmacy | string = $derived(
		pharmacy?.current.find((f) => f.id === value) ?? 'Unknown'
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
			<div>
				<Button
					variant="outline"
					class="w-full justify-between"
					{...props}
					role="combobox"
					aria-expanded={open}
				>
					{typeof selectedValue === 'string' ? selectedValue : `${selectedValue.name}`}
					<ChevronsUpDown class="opacity-50" />
				</Button>
			</div>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root>
			<Input placeholder="Search pharmacy..." class="h-9 p-4" bind:value={searchQuery} />
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
					{#if filteredPharmacy.length !== 0}
						{#each filteredPharmacy as p (p.id)}
							<Command.Item
								value={p.id}
								onSelect={() => {
									value = p.id;
									closeAndFocusTrigger();
								}}
							>
								<Check class={cn(value !== p.id && 'text-transparent')} />
								{p.name}
							</Command.Item>
						{/each}
					{:else if filteredPharmacy.length === 0 && searchQuery !== ''}
						<div class="text-center text-sm font-bold">
							No pharmacies found for the query: "{searchQuery}"
						</div>
					{/if}
				</Command.Group>
			</Command.List>
			<AddPharmacyDialog {createPharmacyForm} {searchQuery} />
		</Command.Root>
	</Popover.Content>
</Popover.Root>
