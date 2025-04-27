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
	<div class="flex flex-row justify-center gap-x-2 px-4 py-4">
		<h1 class=" text-3xl font-bold">
			{data.prescription.medication}
		</h1>
	</div>

	<div class="flex flex-col">
		<div class="flex flex-1 flex-col">
			<div class="shrink-0">
				<!-- Timeline container -->
				<div class="overflow-x-scroll px-4">
					<Timeline />
				</div>
			</div>
			<div class="flex justify-center gap-x-2 p-3">
				<Card.Root class="flex-1">
					<Card.Title class="flex flex-row justify-between p-4">
						<div>Information</div>

						<div class="flex gap-x-4">
							{#each data.prescription.medicationType as mt}
								<Badge
									class="lg:text-md px-0 py-0
                            text-xs sm:px-1 sm:py-1
                            sm:text-xs md:px-2
                            md:text-sm lg:px-3 lg:py-1.5"
									style={`background-color: ${mt.color};`}
								>
									{mt.type}
								</Badge>
							{/each}
						</div>
					</Card.Title>
					<Card.Content>
						<div>
							<span class="font-bold">Notes:</span>
							{data.prescription.notes}
						</div>
					</Card.Content>
				</Card.Root>
				<Card.Root class="flex-1">
					<Card.Title class="flex flex-row justify-between p-4">
						<div>Pharmacy</div>

						<div class="flex gap-x-4">
							<Badge
								class="lg:text-md  px-0
                            py-0 text-xs sm:px-1
                            sm:py-1 sm:text-xs
                            md:px-2 md:text-sm lg:px-3 lg:py-1.5"
								variant={data.prescription.refills <= 1
									? 'destructive'
									: data.prescription.refills <= 4
										? 'warning'
										: 'success'}
							>
								Refills: {data.prescription.refills}
							</Badge>
							<Badge
								class="lg:text-md px-0 py-0
                            text-xs sm:px-1 sm:py-1
                            sm:text-xs md:px-2
                            md:text-sm lg:px-3 lg:py-1.5"
								variant={data.prescription.total <= 5
									? 'destructive'
									: data.prescription.total <= 10
										? 'warning'
										: 'success'}
							>
								Total: {data.prescription.total}
							</Badge>
						</div>
					</Card.Title>
					<Card.Content>
						<div>hello</div>
					</Card.Content>
				</Card.Root>
			</div>
			<div class="p-4">
				<Card.Root>
					<Card.Title class="flex justify-between px-4 pt-4 text-2xl font-bold">
						<div>Healthcare Professional</div>
						<div>
							<Button>Update Information</Button>
						</div>
					</Card.Title>
					<Card.Content class="space-y-2 px-4 pb-4">
						<div>
							<span class="font-semibold">Name:</span>
							{data.prescription.Doctor.firstName + ' ' + data.prescription.Doctor.lastName}
						</div>
						<div>
							<span class="font-semibold">Phone:</span>
							<span class={!data.prescription.Doctor.phoneNumber ? 'italic text-gray-400' : ''}>
								{!data.prescription.Doctor.phoneNumber
									? 'Not Provided'
									: data.prescription.Doctor.phoneNumber}
							</span>
						</div>
						<div>
							<span class="font-semibold">Notes:</span>
							<span class={!data.prescription.Doctor.Notes ? 'italic text-gray-400' : ''}>
								{!data.prescription.Doctor.Notes ? 'Not Provided' : data.prescription.Doctor.Notes}
							</span>
						</div>

						<div class="mt-4 border-t pt-4">
							<h2 class="mb-2 text-xl font-bold">Clinic Information</h2>
							<div>
								<span class="font-semibold">Clinic:</span>
								<span class={!data.prescription.Doctor.Clinic ? 'italic text-gray-400' : ''}>
									{!data.prescription.Doctor.Clinic
										? 'Not Provided'
										: data.prescription.Doctor.Clinic}
								</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>
