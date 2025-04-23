<script lang="ts">
	import Badge from './badge/badge.svelte';
	import { type MedicationType } from '$lib/types/MedicationType.js';

	let { medicationTypes }: { medicationTypes: MedicationType[] } = $props();
</script>

<div class="flex flex-col gap-y-4">
	{#each medicationTypes as type}
		<Badge class={`w-fit `} style={`background-color: ${type.color};`}>{type.type}</Badge>
	{/each}
</div>
