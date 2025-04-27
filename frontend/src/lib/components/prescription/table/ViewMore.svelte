<script lang="ts">
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	let { pId } = $props();
</script>

<div>
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<a href={`/user/prescriptions/${pId}`} class="hover:bg-gray-500">
					<EllipsisVertical />
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content>Click to view more details of the given prescription</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
</div>
