import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
export default defineConfig(({ mode }) => ({
	resolve: {
		conditions: mode === 'test' ? ['browser'] : []
	},
	plugins: [sveltekit(), svelteTesting()],
	server: {
		watch: {
			usePolling: true
		},
		hmr: {
			protocol: 'ws'
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
		include: ['src/**/*.{test,spec}.{js,ts}'], // Only scans unit tests
		exclude: ['**/node_modules/**'],
		browser: {
			instances: [
				{
					browser: 'firefox',
					launch: {},
					context: {}
				}
			]
		}
	}
}));
