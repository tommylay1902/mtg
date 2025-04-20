<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getMedicationTypeContext } from '$lib/context/MedicationContext.js';
	import type { MedicationType } from '$lib/types/MedicationType.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import X from '@lucide/svelte/icons/x';
	type DropdownViewMode = 'All' | 'Selected' | 'Deselected';

	let dropDownViewMode = $state<DropdownViewMode>('All');
	let { isDropdownOpen = $bindable() } = $props();
	let searchQuery = $state<string>('');
	let selectedMedicationTypes = $state<Set<any>>(new Set([]));
	let open = $state(false);

	const medicationTypes = getMedicationTypeContext();

	let searchInput: HTMLInputElement;

	const removeMedicationType = (selected: MedicationType) => {
		const updated = new Set(selectedMedicationTypes);
		updated.delete(selected);
		selectedMedicationTypes = updated;
	};

	const updateSearchQuery = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const newValue = target.value ?? '';
		searchQuery = newValue;
	};

	let filterMedicationTypes: string[] = $derived.by(() => {
		const medicationTypeNames: string[] = medicationTypes.current.map((mt) => mt.type);
		const filteredBySearch = medicationTypeNames.filter((type) =>
			type.toLowerCase().includes(searchQuery.toLowerCase())
		);

		switch (dropDownViewMode) {
			case 'Selected':
				return filteredBySearch.filter((type: string) => selectedMedicationTypes.has(type));
			case 'Deselected':
				return filteredBySearch.filter((type: string) => !selectedMedicationTypes.has(type));
			case 'All':
			default:
				return filteredBySearch;
		}
	});

	const selectAllMedTypes = () => {
		const allMedTypesSet = new Set<string>();
		medicationTypes.current.forEach((mt) => {
			allMedTypesSet.add(mt.type);
		});
		selectedMedicationTypes = allMedTypesSet;
	};

	const deselectAllMedTypes = () => {
		selectedMedicationTypes = new Set<String>();
	};

	let checkedState = $derived.by<Record<string, boolean>>(() => {
		return medicationTypes.current.reduce(
			(acc, mt: MedicationType) => {
				acc[mt.type] = selectedMedicationTypes.has(mt.type);
				return acc;
			},
			{} as Record<string, boolean>
		);
	});

	const toggleCheck = (e: Event, fmt: string) => {
		e.preventDefault();
		const isSelected = !checkedState[fmt];
		checkedState = {
			...checkedState,
			[fmt]: isSelected
		};
		if (isSelected) {
			selectedMedicationTypes = new Set([...selectedMedicationTypes, fmt]);
		} else {
			const updated = new Set(selectedMedicationTypes);
			updated.delete(fmt);
			selectedMedicationTypes = updated;
		}
	};

	function handleKeydown(event: KeyboardEvent) {
		searchInput.focus();
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
					{#if selectedMedicationTypes.size === 0}
						<div class="w-full min-w-full">Click to add medication type(s)</div>
					{:else}
						<div class="flex w-full items-center gap-1">
							{#each selectedMedicationTypes as selected}
								<Badge class="chip" variant="default">
									{selected}
									<button
										onclick={(e) => {
											e.preventDefault();
											removeMedicationType(selected);
										}}
										class="ml-1 rounded-full p-0.5 hover:bg-[#EADCA4]"
									>
										<X class="h-3 w-3" />
									</button>
								</Badge>
							{/each}
						</div>
					{/if}
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="max-h-[50vh] w-[40dvw] overflow-y-auto p-0">
				<div class="z-2000 sticky top-0 border-b bg-background p-2">
					<!-- Search Input with Clear Button -->
					<div class="relative">
						<input
							type="text"
							placeholder="Search medication type(s)..."
							class="z-1000 w-full rounded border bg-white p-1 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
							oninput={updateSearchQuery}
							value={searchQuery}
							bind:this={searchInput}
						/>
						<!-- Clear Button (X Icon) -->
						{#if searchQuery}
							<button
								class="absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground hover:text-foreground"
								onclick={(e: Event) => {
									e.preventDefault();
									searchQuery = '';
								}}
							>
								<X class="h-4 w-4" />
								<!-- X icon -->
							</button>
						{/if}
					</div>

					<div class="m-1 mt-1">
						<Select.Root type="single">
							<Select.Trigger class="h-8 w-full justify-center text-sm hover:bg-accent/50">
								View: {dropDownViewMode}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="DropdownViewMode.All">All</Select.Item>
								<Select.Item value="DropdownViewMode.Selected">Selected</Select.Item>
								<Select.Item value="DropdownViewMode.Deselected">Deselected</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<DropdownMenu.Separator />
				<ScrollArea class="max-h-64 min-h-48 overflow-y-auto pb-0 [&>div]:!p-0">
					{#if filterMedicationTypes.length > 0}
						<div class="flex flex-col">
							{#each filterMedicationTypes as fmt}
								<DropdownMenu.CheckboxItem
									bind:checked={checkedState[fmt]}
									class="flex h-9 w-full px-3 py-2"
									onclick={(e: Event) => toggleCheck(e, fmt)}
								>
									<span class="ml-6 text-xs">{fmt}</span>
								</DropdownMenu.CheckboxItem>
							{/each}
						</div>
					{:else}
						<div class="flex flex-col">
							<span class="pt-5 text-center text-sm italic"> No breeds to display! </span>
						</div>
					{/if}
				</ScrollArea>
				<div class="sticky bottom-0 z-10 m-0 border-t bg-background p-0">
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
