<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
</script>

<div class="animate-pulse-fast space-y-4">
	<!-- Page Title and Filter Tabs -->
	<div class="animate-pulse-fast flex items-center justify-between">
		<Skeleton class=" ml-3 h-8 w-[200px] rounded-md" />
		<div class="flex gap-2">
			<Skeleton class="h-8 w-[100px] rounded-md" />
			<Skeleton class="h-8 w-[100px] rounded-md" />
			<Skeleton class="h-8 w-[100px] rounded-md" />
		</div>
		<Skeleton class="mr-3 h-10 w-[150px] rounded-md" />
	</div>
	<!-- Table Header -->
	<div class="animate-pulse-fast flex items-center gap-4 px-2">
		<Skeleton class="h-5 w-5 rounded" />
		<Skeleton class="h-6 flex-[2] rounded" />
		<Skeleton class="h-6 flex-1 rounded" />
		<Skeleton class="h-6 flex-1 rounded" />
		<Skeleton class="h-6 flex-[0.5] rounded" />
		<Skeleton class="h-6 flex-1 rounded" />
		<Skeleton class="h-6 w-6 rounded-full" />
	</div>

	<!-- Table Row -->
	{#each { length: 10 } as _}
		<div class=" flex items-center gap-4 px-2 py-2">
			<Skeleton class=" h-5 w-5 rounded" />
			<Skeleton class=" h-6 flex-[2] rounded" />
			<Skeleton class=" h-6 flex-1 rounded" />
			<Skeleton class=" h-6 flex-1 rounded-full" />
			<Skeleton class=" h-6 flex-[0.5] rounded" />
			<Skeleton class=" h-6 flex-1 rounded" />
			<Skeleton class=" h-6 w-6 rounded-full" />
		</div>
	{/each}
</div>
