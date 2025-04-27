<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import * as Card from '$lib/components/ui/card/index.js';
	import Timeline from '$lib/components/Timeline.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	let { data } = $props();
</script>

<div class="h-full">
	<h1>
		<Button variant="outline" onclick={() => goto('/user/prescriptions')}>
			<ArrowLeft />
			Prescriptions
		</Button>
	</h1>
	<div class="flex flex-row justify-between gap-x-2 px-4 py-4">
		<h1 class=" text-3xl font-bold">
			{data.prescription.medication}
		</h1>
		<div class="flex gap-x-4">
			{#each data.prescription.medicationType as mt}
				<Badge
					class="px-0 py-0 text-xs
                            sm:px-3 sm:py-1 sm:text-sm
                            md:px-4 md:text-base
                            lg:px-5 lg:py-1.5 lg:text-lg"
					style={`background-color: ${mt.color};`}
				>
					{mt.type}
				</Badge>
			{/each}
		</div>
	</div>

	<div class="flex flex-col">
		<!-- Header content remains the same -->

		<div class="flex flex-1 flex-col">
			<div class="shrink-0">
				<!-- Timeline container -->
				<div class="overflow-x-scroll px-4">
					<Timeline />
				</div>
			</div>
			<div class="flex justify-center gap-x-4 p-3">
				<Card.Root class="flex-1">
					<Card.Title class="p-4">Information</Card.Title>
					<Card.Content>
						<div>
							{data.prescription.notes}
						</div>
					</Card.Content>
				</Card.Root>
				<Card.Root class="flex-1">
					<Card.Title class="p-4">Pharmacy</Card.Title>
					<Card.Content>
						<div>hello</div>
					</Card.Content>
				</Card.Root>
			</div>
			<div class="p-3">
				<Card.Root>
					<Card.Title class="p-4">Doctor</Card.Title>
					<Card.Content>
						<div>hello</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>
