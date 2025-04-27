<script lang="ts">
	import { Menubar as MenubarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: MenubarPrimitive.TriggerProps = $props();
</script>

<MenubarPrimitive.Trigger
	bind:ref
	class={cn(
		'm-0 flex items-center justify-center rounded bg-transparent p-0 hover:bg-gray-100 focus:outline-none focus:ring-0',
		className
	)}
	{...restProps}
/>
