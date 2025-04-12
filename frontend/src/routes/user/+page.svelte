<script lang="ts">
	let { data } = $props();
	let { supabase, user } = $derived(data);
</script>

<h1>Private page for user: {user?.email}</h1>
<h2>Notes</h2>
