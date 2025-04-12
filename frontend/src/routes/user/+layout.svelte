<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { redirect } from '@sveltejs/kit';
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
	<Navbar />
	<Button variant="destructive" onclick={logout}>Logout</Button>
</header>
<main>
	{@render children()}
</main>
