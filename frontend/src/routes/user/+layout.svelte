<script lang="ts">
	import { beforeNavigate, afterNavigate, goto } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import PrescriptionLoading from '$lib/components/loading/prescription-loading.svelte';

	let { data, children } = $props();
	let loading = $state(false);
	let loadingComponent = $state(PrescriptionLoading);

	// @ts-ignore
	let { supabase } = $derived(data);

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error(error);
		else goto('/auth');
	};

	beforeNavigate(({ to }) => {
		loading = true;
		const route = to?.url?.pathname;
		console.log(route);
		if (route === '/user/prescriptions') {
			loadingComponent = PrescriptionLoading;
		} else if (route?.startsWith('/user/prescriptions/')) {
			loadingComponent = PrescriptionLoading;
		} else if (route === '/user/dashboard') {
			loadingComponent = PrescriptionLoading;
		} else {
			loadingComponent = PrescriptionLoading;
		}
	});

	afterNavigate(() => {
		loading = false;
	});
</script>

<header>
	<Navbar {logout} />
</header>

<main>
	{#if loading}
		{@const LoadingComponent = loadingComponent}
		<LoadingComponent />
	{:else}
		{@render children()}
		<Toaster richColors />
	{/if}
</main>
