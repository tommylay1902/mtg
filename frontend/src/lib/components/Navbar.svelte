<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/user/dashboard', text: 'Dashboard' },
		{ href: '/user/prescription', text: 'Prescriptions' },
		{ href: '/user/events', text: 'Events' }
	];
</script>

<nav class={'h-15 m-3 flex items-center space-x-4 lg:space-x-6'}>
	{#each links as link}
		<a
			href={link.href}
			class="{link.href === page.url.pathname
				? 'text-primary'
				: 'text-muted-foreground'} hover:text-primary text-sm font-medium transition-colors"
			>{link.text}</a
		>
	{/each}
</nav>
