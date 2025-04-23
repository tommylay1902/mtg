<script lang="ts">
	import Badge from './badge/badge.svelte';
	import { type MedicationType } from '$lib/types/MedicationType.js';

	let { medicationTypes }: { medicationTypes: MedicationType[] } = $props();
</script>

<span class="flex flex-row gap-x-2">
	{#each medicationTypes as type}
		<Badge class={`w-fit`} style={`background-color: ${type.color};`}>{type.type}</Badge>
	{/each}
</span>
