import { redirect } from '@sveltejs/kit';

import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types.js';
import { z, ZodIssueCode } from 'zod';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';

const loginSchema = z.object({
	email: z.string().email('Invalid Email Address').min(2, 'Email must be longer then 2 character'),
	password: z.string().min(8, 'Password must be length 8 or greater')
});

const registerSchema = z
	.object({
		email: z.string().email('Invalid Email Address'),
		password: z.string().min(8),
		confirmPassword: z.string().min(8)
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: "Passwords don't match",
				path: ['password']
			});
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: "Passwords don't match",
				path: ['confirmPassword']
			});
		}
	});

export const load: PageServerLoad = async () => {
	// Different schemas, no id required.
	const loginForm = await superValidate(zod(loginSchema));
	const registerForm = await superValidate(zod(registerSchema));

	// Return them both
	return { loginForm, registerForm };
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const registerForm = await superValidate(request, zod(registerSchema));
		if (!registerForm.valid) return fail(400, { registerForm });

		const { data, error } = await supabase.auth.signUp({
			email: registerForm.data.email,
			password: registerForm.data.password
		});
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else if (data.user?.identities?.length === 0) {
			return setError(registerForm, 'email', 'E-mail already exists.');
		} else {
			redirect(303, '/');
		}
	},
	login: async ({ request, locals: { supabase } }) => {
		const loginForm = await superValidate(request, zod(loginSchema));
		if (!loginForm.valid) return fail(400, { loginForm });

		// TODO: Login user

		const { error } = await supabase.auth.signInWithPassword({
			email: loginForm.data.email,
			password: loginForm.data.password
		});
		if (error) {
			if (error.code === 'email_not_confirmed') {
				return { confirm_email: true };
			} else {
				loginForm.errors.password = ['Invalid email or password'];
				loginForm.errors.email = ['Invalid email or password'];
				return fail(400, { loginForm });
			}
		} else {
			redirect(303, '/user/dashboard');
		}
	}
};
