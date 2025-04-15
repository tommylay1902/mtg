<script lang="ts" generics="TData extends Prescription, TValue">
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import {
		type RowSelectionState,
		type SortingState,
		getCoreRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import type { Prescription } from './Columns.js';
	import { columns } from '$lib/components/table/prescription/Columns.js';
	import { getPrescriptionContext } from '$lib/context/PrescriptionContext.js';

	type DataTableProps<TData, TValue> = {
		rowSelection: RowSelectionState;
		// onRowSelectionChange?: (selection: RowSelectionState) => void;
	};

	let { rowSelection = $bindable() }: DataTableProps<TData, TValue> = $props();
	const prescriptions = getPrescriptionContext();
	let sorting = $state<SortingState>([]);

	const table = createSvelteTable({
		get data() {
			return prescriptions.current as TData[];
		},
		columns: columns<TData>(),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		getRowId: (row: TData) => (row as Prescription).id,
		state: {
			get sorting() {
				return sorting;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});
</script>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
