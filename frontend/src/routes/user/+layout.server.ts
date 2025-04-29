import type { LayoutServerLoad } from './$types.js';
import type { Prescription } from '$lib/types/Prescription.js';
import type { Doctor } from '$lib/types/Doctor.js';
import type { MedicationType } from '$lib/types/MedicationType.js';

export const load: LayoutServerLoad = async ({ fetch, locals: { safeGetSession } }) => {
	try {
		const { session } = await safeGetSession();

		const fetchOptions = {
			headers: {
				Authorization: `Bearer ${session?.access_token}`
			}
		};

		// Remove the duplicate fetches (you had them both individually and in Promise.allSettled)
		const results = await Promise.allSettled([
			fetch('/api/prescriptions?type=prescriptions', fetchOptions),
			fetch('/api/medication-type', fetchOptions),
			fetch('/api/doctors', fetchOptions)
		]);

		// Helper function that returns just the data or throws
		const getDataOrThrow = async <T>(result: PromiseSettledResult<Response>): Promise<T> => {
			if (result.status === 'rejected') {
				throw new Error(result.reason.message || 'Request failed');
			}

			try {
				return (await result.value.json()) as T;
			} catch (error) {
				throw new Error(error instanceof Error ? error.message : 'Failed to parse response');
			}
		};

		// Process all results - any failures will be caught by the outer try/catch
		const [prescriptions, medicationTypes, doctors] = await Promise.all([
			getDataOrThrow<Prescription[]>(results[0]),
			getDataOrThrow<MedicationType[]>(results[1]),
			getDataOrThrow<Doctor[]>(results[2])
		]);

		return {
			prescription: prescriptions,
			medicationTypes: medicationTypes,
			doctors: doctors
		};
	} catch (err) {
		console.error(err);
		// Return empty arrays instead of throwing to prevent page crash
		return {
			prescription: [],
			medicationTypes: [],
			doctors: [],
			error: err instanceof Error ? err.message : 'Failed to load data'
		};
	}
};
