import type { ColumnDef, SortingFn } from '@tanstack/table-core';
import DataTableCheckbox from './DataTableCheckbox.svelte';

import { renderComponent } from '$lib/components/ui/data-table/render-helpers.js';
import GenericSortHeader from './header/GenericSortHeader.svelte';

// This type is used to define the shape of our data.

export type Prescription = {
	id: string;
	medication: string;
	dosage: string;
	notes: string;
	started: string;
	ended: string;
	refills: number;
};

const dateSortingFn = <T extends Prescription>(rowA: any, rowB: any, columnId: string): number => {
	const dateA = new Date(rowA.original[columnId as keyof Prescription] as string);
	const dateB = new Date(rowB.original[columnId as keyof Prescription] as string);

	return dateA.getTime() - dateB.getTime();
};

const numberSortingFn = <T extends Prescription>(
	rowA: any,
	rowB: any,
	columnId: string
): number => {
	const numA = rowA.original[columnId as keyof Prescription] as number;
	const numB = rowB.original[columnId as keyof Prescription] as number;
	return numA - numB;
};

export const columns = <T extends Prescription>(): ColumnDef<T>[] => [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'medication',
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Medication' })
	},
	{
		accessorKey: 'dosage',
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Dosage' })
	},
	{
		accessorKey: 'notes',
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Notes' }),
		cell: ({ row }) => {
			const notes = row.original.notes;
			if (notes.length >= 60) {
				return notes.slice(0, 60) + '...';
			}
			return notes;
		}
	},
	{
		accessorKey: 'started',
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Started' }),
		sortingFn: dateSortingFn
	},
	{
		accessorKey: 'ended',
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Ended' }),
		sortingFn: dateSortingFn
	},
	{
		accessorKey: 'refills',
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Refills' }),
		sortingFn: numberSortingFn
	}
];
