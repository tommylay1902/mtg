<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	let { isOpen = $bindable() } = $props();
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="min-w-[80dvw]">
		<Dialog.Header>
			<Dialog.Title>Refill Prescriptions</Dialog.Title>
		</Dialog.Header>
		<div></div>
	</Dialog.Content>
</Dialog.Root>
