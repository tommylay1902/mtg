<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Trash from '@lucide/svelte/icons/trash';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Refresh from '@lucide/svelte/icons/refresh-cw';

	let { isDeleteDialogOpen = $bindable(), isUpdateDialogOpen = $bindable() } = $props();
</script>

<div
	class="fixed bottom-8 left-1/2 flex -translate-x-1/2 transform animate-float-up gap-4 rounded-full bg-slate-700 p-4"
>
	<div class="group relative">
		<Button
			variant="destructive"
			class="peer/delete rounded-full transition-all duration-300 hover:scale-110 group-hover/update:scale-90 [&_svg]:size-5"
			onclick={() => {
				isDeleteDialogOpen = true;
			}}
		>
			<Trash /> Delete
		</Button>
		<div
			class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100"
		>
			<div
				class="whitespace-nowrap rounded-full bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground shadow-md"
			>
				Delete Prescription(s)
			</div>
		</div>
	</div>

	<div class="group relative">
		<Button
			class="peer/update rounded-full bg-black transition-all duration-300 hover:scale-110 [&_svg]:size-5"
			onclick={() => {
				isUpdateDialogOpen = true;
			}}
		>
			<Pencil size={32} /> Update
		</Button>
		<div
			class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100"
		>
			<div
				class="whitespace-nowrap rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow-md"
			>
				Update Prescription(s)
			</div>
		</div>
	</div>
	<div class="group relative">
		<Button
			variant="outline"
			class="peer/delete rounded-full transition-all duration-300 hover:scale-110 group-hover/update:scale-90 [&_svg]:size-5"
		>
			<Refresh /> Refill
		</Button>
		<div
			class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100"
		>
			<div
				class="whitespace-nowrap rounded-full bg-white px-3 py-1 text-sm font-medium text-black shadow-md"
			>
				Refill Prescription(s)
			</div>
		</div>
	</div>
</div>
