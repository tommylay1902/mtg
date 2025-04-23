import type { ColumnDef } from '@tanstack/table-core';
import DataTableCheckbox from './DataTableCheckbox.svelte';
import { renderComponent } from '$lib/components/ui/data-table/render-helpers.js';
import GenericSortHeader from '../table/header/GenericSortHeader.svelte';
import { type Prescription } from '$lib/types/Prescription.js';
import MTBadge from '$lib/components/ui/MTBadge.svelte';

// This type is used to define the shape of our data.

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

function formatISODateForUserDisplay(isoString: string) {
	const displayDate = new Date(isoString).toLocaleString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});

	return displayDate;
}

export const columns = <T extends Prescription>(): ColumnDef<T>[] => [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value: any) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value: any) => row.toggleSelected(!!value),
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
		accessorKey: 'medicationType',
		header: ({ column }) => 'Medication Type',
		cell: ({ row }) => {
			return renderComponent(MTBadge, { medicationTypes: row.original.medicationType });
		}
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
		cell: ({ row }) => {
			if (!row.original.started) {
				return 'Unknown';
			}
			return formatISODateForUserDisplay(row.original.started);
		},
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Started' }),
		sortingFn: dateSortingFn
	},
	{
		accessorKey: 'ended',
		cell: ({ row }) => {
			if (!row.original.ended) {
				return 'Present';
			}
			return formatISODateForUserDisplay(row.original.ended);
		},
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Ended' }),
		sortingFn: dateSortingFn
	},
	{
		accessorKey: 'refills',
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Refills' }),
		sortingFn: numberSortingFn
	},
	{
		accessorKey: 'total',
		header: ({ column }) => renderComponent(GenericSortHeader, { column, title: 'Total' }),
		sortingFn: numberSortingFn
	}
];
