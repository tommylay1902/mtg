<script lang="ts">
	import { page } from '$app/state';
	import Button from './ui/button/button.svelte';

	const links = [
		{ href: '/user/dashboard', text: 'Dashboard' },
		{ href: '/user/prescriptions', text: 'Prescriptions' },
		{ href: '/user/events', text: 'Events' },
		{ href: '/user/doctors', text: 'Doctors' },
		{ href: '/user/provider-management', text: 'Provider Management' }
	];

	const { logout } = $props();
</script>

<nav class="h-15 mb-3 flex items-center justify-between bg-gray-200 p-5">
	<div class="text-3xl font-bold">MTG</div>
	<div class="flex flex-grow justify-center gap-x-4">
		{#each links as link}
			<a
				href={link.href}
				class="block rounded-full px-3 py-1 text-sm font-medium transition-colors {link.href ===
				page.url.pathname
					? 'bg-primary text-primary-foreground'
					: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}">{link.text}</a
			>
		{/each}
	</div>
	<div>
		<Button variant="destructive" onclick={logout}>Logout</Button>
	</div>
</nav>
