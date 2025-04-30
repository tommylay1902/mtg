<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getMedicationTypeContext } from '$lib/context/MedicationContext.js';
	import type { MedicationType } from '$lib/types/MedicationType.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import X from '@lucide/svelte/icons/x';
	import AddMedicationTypeDialog from '$lib/components/prescription/dialog/AddMedicationTypeDialog.svelte';

	type DropdownViewMode = 'All' | 'Selected' | 'Deselected';

	let dropDownViewMode = $state<DropdownViewMode>('All');
	let { isDropdownOpen = $bindable(), value = $bindable(), createMedTypeForm } = $props();
	let searchQuery = $state<string>('');
	let selectedMedicationTypes = $state<Set<MedicationType>>(new Set(value));
	const medicationTypes = getMedicationTypeContext();

	let searchInput: HTMLInputElement;

	const removeMedicationType = (med: MedicationType) => {
		const updated = new Set(selectedMedicationTypes);
		// Find the exact item to delete by comparing IDs
		for (const item of updated) {
			if (item.id === med.id) {
				updated.delete(item);
				break;
			}
		}
		selectedMedicationTypes = updated;
		value = Array.from(updated);
	};
	const updateSearchQuery = (e: Event) => {
		searchQuery = (e.target as HTMLInputElement).value ?? '';
	};

	let filteredMedicationTypes: MedicationType[] = $derived.by(() => {
		if (medicationTypes.current && medicationTypes.current.length > 0) {
			const searchLower = searchQuery.toLowerCase();
			const filtered = medicationTypes.current.filter((mt) =>
				mt.type.toLowerCase().includes(searchLower)
			);

			switch (dropDownViewMode) {
				case 'Selected':
					return filtered.filter((mt) =>
						Array.from(selectedMedicationTypes).some((s) => s.id === mt.id)
					);
				case 'Deselected':
					return filtered.filter(
						(mt) => !Array.from(selectedMedicationTypes).some((s) => s.id === mt.id)
					);
				default:
					return filtered;
			}
		}
		return [];
	});

	const selectAllMedTypes = () => {
		const newSelection = new Set<MedicationType>();
		medicationTypes.current.forEach((mt) => {
			newSelection.add({ id: mt.id, type: mt.type, color: mt.color });
		});
		selectedMedicationTypes = newSelection;
		value = Array.from(newSelection);
	};

	const deselectAllMedTypes = () => {
		selectedMedicationTypes = new Set();
		value = [];
	};

	let checkedState = $derived.by<Record<string, boolean>>(() => {
		const state: Record<string, boolean> = {};
		medicationTypes.current.forEach((mt) => {
			state[mt.id] = Array.from(selectedMedicationTypes).some((s) => s.id === mt.id);
		});
		return state;
	});

	const toggleCheck = (e: Event, mt: MedicationType) => {
		e.preventDefault();
		const isSelected = !checkedState[mt.id];

		const updated = new Set(selectedMedicationTypes);
		if (isSelected) {
			updated.add({ id: mt.id, type: mt.type, color: mt.color });
		} else {
			Array.from(updated).forEach((item) => {
				if (item.id === mt.id) updated.delete(item);
			});
		}

		selectedMedicationTypes = updated;
		value = Array.from(updated);
	};

	function handleKeydown(event: KeyboardEvent) {
		if (!isDropdownOpen || !searchInput) return;

		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}

		if (
			event.ctrlKey ||
			event.altKey ||
			event.metaKey ||
			event.key === 'Control' ||
			event.key === 'Alt' ||
			event.key === 'Meta' ||
			event.key === 'Shift' ||
			event.key === 'Tab' ||
			event.key === 'Enter' ||
			event.key === 'Escape' ||
			event.key === 'ArrowUp' ||
			event.key === 'ArrowDown' ||
			event.key === 'ArrowLeft' ||
			event.key === 'ArrowRight'
		) {
			return;
		}

		event.preventDefault();
		searchInput.focus();

		// If it's a printable character, add it to the search query
		if (event.key.length === 1) {
			searchQuery += event.key;
			// Move cursor to end of input
			searchInput.selectionStart = searchQuery.length;
			searchInput.selectionEnd = searchQuery.length;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />
<div class="w-full">
	<div class="w-full">
		<DropdownMenu.Root bind:open={isDropdownOpen}>
			<DropdownMenu.Trigger class="w-full">
				<Button
					type="button"
					variant="outline"
					class="flex h-auto min-h-fit w-full min-w-full flex-wrap items-center gap-2 hover:bg-gray-300"
				>
					<div class="w-full min-w-full">Click to add medication type(s)</div>
				</Button>
			</DropdownMenu.Trigger>

			{#if selectedMedicationTypes.size > 0}
				<div class="mt-2 flex flex-wrap items-center justify-center gap-1 border p-3">
					{#each Array.from(selectedMedicationTypes) as selected}
						<Badge style={`background-color: ${selected.color};`}>
							{selected.type}
							<button
								type="button"
								onclick={() => removeMedicationType(selected)}
								class="ml-1 rounded-full p-0.5 hover:bg-[#EADCA4]"
							>
								<X class="h-3 w-3" />
							</button>
						</Badge>
					{/each}
				</div>
			{/if}
			<DropdownMenu.Content class="max-h-[50vh] w-[40dvw] overflow-y-scroll p-0">
				<div class="sticky top-0 z-10 border-b bg-white p-2">
					<div class="relative">
						<input
							type="text"
							placeholder="Search or add medication types"
							class="w-full rounded border bg-white p-1 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
							bind:this={searchInput}
							oninput={updateSearchQuery}
							value={searchQuery}
						/>
						{#if searchQuery}
							<button
								class="absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground hover:text-foreground"
								onclick={(e: Event) => {
									e.preventDefault();
									searchQuery = '';
								}}
							>
								<X class="h-4 w-4" />
							</button>
						{/if}
					</div>

					<div class="m-1 mt-1">
						<Select.Root type="single" bind:value={dropDownViewMode}>
							<Select.Trigger class="h-8 w-full justify-center text-sm hover:bg-accent/50">
								View: {dropDownViewMode}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="All">All</Select.Item>
								<Select.Item value="Selected">Selected</Select.Item>
								<Select.Item value="Deselected">Deselected</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<ScrollArea class="max-h-64 min-h-48  pb-0 [&>div]:!p-0">
						{#if filteredMedicationTypes.length > 0}
							<div class="flex flex-col">
								{#each filteredMedicationTypes as mt}
									<DropdownMenu.CheckboxItem
										bind:checked={checkedState[mt.id]}
										class="flex h-9 w-full px-3 py-2 hover:bg-gray-300"
										onclick={(e: Event) => toggleCheck(e, mt)}
									>
										<span class={`ml-6 text-xs font-bold`}>{mt.type}</span>
										<span
											class="m-3 flex h-5 w-5 items-center justify-center rounded-full text-xs"
											style={`background-color: ${mt.color}; color: white`}
										>
										</span>
									</DropdownMenu.CheckboxItem>
								{/each}
							</div>
						{:else}
							<div class="flex flex-col">
								<div class="pt-5 text-center text-sm italic">
									{#if searchQuery.length > 0}
										<div>
											No medications found with search: <span class="font-bold">{searchQuery}</span>
											<div>
												<AddMedicationTypeDialog
													{searchQuery}
													{createMedTypeForm}
													isButton={false}
												/>
											</div>
										</div>
									{:else}
										No medication types to display!
									{/if}
								</div>
							</div>
						{/if}
					</ScrollArea>
				</DropdownMenu.Group>
				<div class="sticky bottom-0 z-10 m-0 border-t bg-background p-0">
					<div class="flex w-full text-center">
						<AddMedicationTypeDialog {searchQuery} {createMedTypeForm} isButton={true} />
					</div>

					<div class="flex">
						<Button
							variant="outline"
							class="h-8 w-full justify-start hover:bg-gray-300"
							size="sm"
							onclick={selectAllMedTypes}
						>
							<span class="w-full text-center">Select All</span>
						</Button>
						<Button
							variant="outline"
							class="h-8 w-full justify-start hover:bg-gray-300"
							size="sm"
							onclick={deselectAllMedTypes}
						>
							<span class="w-full text-center">Deselect All</span>
						</Button>
					</div>

					<Button
						variant="outline"
						class="h-8 w-full justify-start hover:bg-gray-300"
						size="sm"
						onclick={() => (isDropdownOpen = false)}
					>
						<span class="w-full text-center">Close</span>
					</Button>
				</div>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
