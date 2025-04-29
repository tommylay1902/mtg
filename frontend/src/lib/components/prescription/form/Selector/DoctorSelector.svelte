<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { getDoctorContext } from '$lib/context/DoctorContext.js';
	import type { Doctor } from '$lib/types/Doctor.js';
	import AddDoctorTypeDialog from '../../dialog/AddDoctorTypeDialog.svelte';

	const doctors = getDoctorContext();

	let { value = $bindable(), createDoctorForm } = $props();

	let open = $state(false);

	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue: Doctor | string = $derived(
		doctors?.current.find((f) => f.id === value) ?? 'Select a healthcare professional...'
	);

	let searchQuery = $state('');
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-full justify-between"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				{typeof selectedValue === 'string' ? 'Select a doctor...' : selectedValue.lastName}
				<ChevronsUpDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root>
			<Command.Input
				placeholder="Search by last name..."
				class="h-9"
				oninput={(e) => (searchQuery = (e.target as HTMLInputElement).value ?? '')}
			/>
			<Command.List>
				<Command.Empty>
					<div>No Doctors found</div>
					<AddDoctorTypeDialog {searchQuery} {createDoctorForm} isButton={false} />
				</Command.Empty>
				<Command.Group>
					<Command.Item
						value=""
						onSelect={() => {
							value = '';
							closeAndFocusTrigger();
						}}
					>
						<Check class={cn(value !== '' && 'text-transparent')} />
						{'Unknown'}
					</Command.Item>
					{#each doctors.current as doctor (doctor.id)}
						<Command.Item
							value={doctor.id}
							onSelect={() => {
								value = doctor.id;
								closeAndFocusTrigger();
							}}
						>
							<Check class={cn(value !== doctor.id && 'text-transparent')} />
							{doctor.lastName}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
			<AddDoctorTypeDialog {searchQuery} {createDoctorForm} isButton={true} />
		</Command.Root>
	</Popover.Content>
</Popover.Root>
