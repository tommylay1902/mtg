import type { LayoutServerLoad } from './$types.js';
import type { Prescription } from '$lib/types/Prescription.js';
import type { Doctor } from '$lib/types/Doctor.js';
import type { MedicationType } from '$lib/types/MedicationType.js';
import type { Pharmacy } from '$lib/types/Pharmacy.js';

export const load: LayoutServerLoad = async ({ fetch }) => {
	try {
		const results = await Promise.allSettled([
			fetch('/api/prescriptions?type=prescriptions'),
			fetch('/api/medication-type'),
			fetch('/api/doctors'),
			fetch('/api/healthcare-facility?type=pharmacy')
		]);

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

		const [prescriptions, medicationTypes, doctors, pharmacy] = await Promise.all([
			getDataOrThrow<Prescription[]>(results[0]),
			getDataOrThrow<MedicationType[]>(results[1]),
			getDataOrThrow<Doctor[]>(results[2]),
			getDataOrThrow<Pharmacy[]>(results[3])
		]);

		return {
			prescription: prescriptions,
			medicationTypes,
			doctors,
			pharmacy
		};
	} catch (err) {
		console.error(err);
		return {
			prescription: [],
			medicationTypes: [],
			doctors: [],
			pharmacy: [],
			error: err instanceof Error ? err.message : 'Failed to load data'
		};
	}
};
