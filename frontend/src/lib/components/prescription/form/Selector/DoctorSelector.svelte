<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	let doctors = $state([]);
	let searchQuery = $state('');
	let searchInput: HTMLInputElement;

	function handleKeydown(event: KeyboardEvent) {
		if (!searchInput) return;

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

	const updateSearchQuery = (e: Event) => {
		searchQuery = (e.target as HTMLInputElement).value ?? '';
	};
</script>

<svelte:window onkeydown={handleKeydown} />
<Select.Root type="single">
	<Select.Trigger>Who placed the prescription order</Select.Trigger>
	<Select.Content>
		<div>
			<input
				class="z-1000 w-full rounded border bg-white p-1 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
				type="text"
				placeholder="Search for doctor..."
				bind:this={searchInput}
				oninput={updateSearchQuery}
				value={searchQuery}
			/>
		</div>

		{#if doctors.length === 0}
			<div class="flex flex-col">
				<span class="pt-5 text-center text-sm italic"> No Doctors to display </span>
			</div>
		{/if}
	</Select.Content>
</Select.Root>
