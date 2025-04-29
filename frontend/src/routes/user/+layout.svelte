<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { data, children } = $props();

	// @ts-ignore
	let { supabase } = $derived(data);

	const logout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error(error);
		} else {
			goto('/auth');
		}
	};
</script>

<header>
	<Navbar {logout} />
</header>
<main>
	{@render children()}
	<Toaster richColors />
</main>
