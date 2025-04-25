<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.OverlayProps = $props();
</script>

<DialogPrimitive.Overlay
	bind:ref
	class={cn(
		'data-[state=open]:anmiate fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=open]:fade-in-0',
		className
	)}
	{...restProps}
/>
