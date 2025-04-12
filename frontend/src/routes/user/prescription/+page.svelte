<script lang="ts">
	let { data } = $props();
	import * as Table from '$lib/components/ui/table/index.js';
	let prescriptions = $state(data.prescription);
</script>

<div>
	<h1>Prescriptions</h1>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Medication</Table.Head>
				<Table.Head>Dosage</Table.Head>
				<Table.Head>Notes</Table.Head>
				<Table.Head>Started</Table.Head>
				<Table.Head>Ended</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each prescriptions as prescription}
				<Table.Row>
					<Table.Cell>
						{prescription.medication}
					</Table.Cell>
					<Table.Cell>
						{prescription.dosage}
					</Table.Cell>
					<Table.Cell>
						{prescription.notes}
					</Table.Cell>
					<Table.Cell>
						{new Date(
							prescription.started.substring(0, prescription.started.length - 1)
						).toLocaleDateString()}
					</Table.Cell>
					<Table.Cell>
						{new Date(
							prescription.ended.substring(0, prescription.ended.length - 1)
						).toLocaleDateString()}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
