<script lang="ts">
	import { page } from '$app/state';
	import Button from './ui/button/button.svelte';

	const links = [
		{ href: '/user/dashboard', text: 'Dashboard' },
		{ href: '/user/prescriptions', text: 'Prescriptions' },
		{ href: '/user/events', text: 'Events' },
		{ href: '/user/doctors', text: 'Doctors' }
	];

	const { logout } = $props();
</script>

<nav class={'h-15 m-3 flex items-center justify-between space-x-4 lg:space-x-6'}>
	<div class="flex gap-x-4">
		{#each links as link}
			<a
				href={link.href}
				class="{link.href === page.url.pathname
					? 'text-primary'
					: 'text-muted-foreground'} block text-sm font-medium transition-colors hover:text-primary"
				>{link.text}</a
			>
		{/each}
	</div>
	<div>
		<Button variant="destructive" onclick={logout}>Logout</Button>
	</div>
</nav>
