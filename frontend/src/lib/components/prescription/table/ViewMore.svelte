<script lang="ts">
	import Info from '@lucide/svelte/icons/info';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	let { pId } = $props();
</script>

<div>
	<Tooltip.Provider delayDuration={20}>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<a href={`/user/prescriptions/${pId}`} class="hover:bg-gray-500">
					<Info class="hover:text-blue-600" />
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content>Click to view more details...</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
</div>
