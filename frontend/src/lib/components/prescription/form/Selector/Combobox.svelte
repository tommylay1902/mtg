<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { Input } from '$lib/components/ui/input/index.js';

	type ComboboxItem = {
		id: string;
		displayValue: string;
		[key: string]: any; // Allow additional properties
	};

	type Props = {
		items: ComboboxItem[];
		value?: string;
		placeholder?: string;
		searchPlaceholder?: string;
		emptyText?: string;
		addDialog?: any;
		addNewProps?: Record<string, any>;
	};

	let {
		items = [],
		value = $bindable(),
		placeholder = 'Select an item...',
		searchPlaceholder = 'Search...',
		emptyText = 'No items found',
		addDialog,
		addNewProps = {}
	}: Props = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let searchQuery = $state('');

	// Filter items based on search query
	const filteredItems = $derived.by(() => {
		if (!searchQuery) return items;
		return items.filter((item) =>
			item.displayValue.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	const selectedValue = $derived(
		items.find((item) => item.id === value)?.displayValue || placeholder
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
					{selectedValue}
					<ChevronsUpDown class="opacity-50" />
				</Button>
			</div>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root>
			<Input placeholder={searchPlaceholder} class="h-9 p-4" bind:value={searchQuery} />
			<Command.List>
				<Command.Group>
					{#if filteredItems.length !== 0}
						{#each filteredItems as item (item.id)}
							<Command.Item
								value={item.id}
								onSelect={() => {
									value = item.id;
									closeAndFocusTrigger();
								}}
							>
								<Check class={cn(value !== item.id && 'text-transparent')} />
								{item.displayValue}
							</Command.Item>
						{/each}
					{:else}
						<div class="text-center text-sm font-bold">
							{emptyText}
							{searchQuery ? `for "${searchQuery}"` : ''}
						</div>
					{/if}
				</Command.Group>
			</Command.List>
			{#if addDialog}
				{@render addDialog({ ...addNewProps, searchQuery })}
			{/if}
		</Command.Root>
	</Popover.Content>
</Popover.Root>
