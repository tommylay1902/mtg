import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		watch: {
			usePolling: true
		},
		hmr: {
			protocol: 'ws'
		}
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
