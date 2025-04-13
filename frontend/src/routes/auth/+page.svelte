<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	import { superForm } from 'sveltekit-superforms/client';

	let { data } = $props();
	const { form, errors, enhance, message, constraints } = superForm(data.loginForm, {
		resetForm: true
	});

	const {
		form: registerForm,
		errors: registerErrors,
		enhance: registerEnhance,
		message: registerMessage
	} = superForm(data.registerForm, {
		resetForm: true
	});
</script>

<div class=" flex min-h-screen items-center justify-center">
	<Tabs.Root value="login" class="w-[50%]">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="login">Log In</Tabs.Trigger>
			<Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="login" class="animate-float-up ">
			<Card.Root class=" h-[500px] w-full p-6">
				<Card.Title class="mb-4 text-center text-2xl font-bold">Login</Card.Title>

				<Card.Content>
					<form method="POST" action="?/login" use:enhance class="flex h-full flex-col">
						<div class="flex-grow">
							<div class="space-y-2">
								<Label for="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									bind:value={$form.email}
									aria-invalid={$errors.email ? 'true' : undefined}
									class={$errors.email ? 'border-red-500' : ''}
								/>
								<div class="min-h-5">
									{#if $errors.email}
										<p class="p-0 text-sm text-red-500">{$errors.email[0]}</p>
									{/if}
								</div>
							</div>

							<div class="space-y-2">
								<Label for="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									bind:value={$form.password}
									aria-invalid={$errors.password ? 'true' : undefined}
									class={$errors.password ? 'border-red-500' : ''}
								/>
								<div class="min-h-5">
									{#if $errors.password}
										<p class="text-sm text-red-500">{$errors.password}</p>
									{/if}
								</div>
							</div>
							<div class="mt-32 pt-4">
								<Button type="submit" class=" w-full py-2">Login</Button>
							</div>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="signup" class="animate-float-up">
			<Card.Root class="h-[500px] w-full p-6">
				<Card.Title class="mb-4 text-center text-2xl font-bold">Sign Up</Card.Title>

				<Card.Content>
					<form method="POST" action="?/signup" use:registerEnhance class="space-y-4">
						<div class="space-y-2">
							<Label for="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								bind:value={$registerForm.email}
								aria-invalid={$registerErrors.email ? 'true' : undefined}
								class={$registerErrors.email ? 'border-red-500' : ''}
							/>
							<div class="min-h-5">
								{#if $registerErrors.email}
									<p class="text-sm text-red-500">{$registerErrors.email[0]}</p>
								{/if}
							</div>
						</div>

						<div class="space-y-2">
							<Label for="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								bind:value={$registerForm.password}
								aria-invalid={$registerForm.password ? 'true' : undefined}
								class={$registerErrors.password ? 'border-red-500' : ''}
							/>
							<div class="min-h-5">
								{#if $registerErrors.password}
									<p class="text-sm text-red-500">{$registerErrors.password}</p>
								{/if}
							</div>
						</div>

						<div class="space-y-2">
							<Label for="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								bind:value={$registerForm.confirmPassword}
								aria-invalid={$registerForm.confirmPassword ? 'true' : undefined}
								class={$registerErrors.confirmPassword ? 'border-red-500' : ''}
							/>
							<div class="min-h-5">
								{#if $registerErrors.confirmPassword}
									<p class="text-sm text-red-500">{$registerErrors.confirmPassword}</p>
								{/if}
							</div>
						</div>
						<Button type="submit" class="w-full py-2">Create Account</Button>
					</form>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
