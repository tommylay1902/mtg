<script lang="ts">
	import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import { Button } from '$lib/components/ui/button/index.js';

	let { column, title, ...restProps } = $props();
	$inspect(column.getSortIndex());
</script>

<Button variant="ghost" {...restProps} onclick={() => column.toggleSorting(undefined, true)}>
	{title}
	{#if column.getIsSorted() === 'asc'}
		<ArrowUp class="ml-2" />
	{:else if column.getIsSorted() === 'desc'}
		<ArrowDown class="ml-2" />
	{:else}
		<ArrowUpDown class="ml-2" />
	{/if}
</Button>
