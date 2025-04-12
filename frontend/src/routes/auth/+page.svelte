<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Label from '$lib/components/ui/label/index.js';
	let { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center justify-items-center">
	<Card.Root class="w-[50%] p-4">
		<Card.Title class="text-center">Login</Card.Title>
		<Card.Content class="flex w-full items-center justify-center">
			<form method="POST" action="?/login">
				<div class="flex flex-col items-center justify-center justify-items-center gap-y-2">
					<Label.Root>
						Email
						<Input name="email" type="email" />
						{#if form?.confirm_email}
							<div class="min-h-5 font-semibold text-yellow-500">
								You need to confirm your email
							</div>
						{/if}
					</Label.Root>
					<Label.Root>
						Password
						<Input name="password" type="password" />
					</Label.Root>
					<div class="pt-10">
						<Button type="submit">Login</Button>
						<Button formaction="?/signup">Sign up</Button>
					</div>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
