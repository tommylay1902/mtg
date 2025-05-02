import type { Pharmacy } from '$lib/types/Pharmacy.js';

export class PharmacyState {
	pharmacy = $state<Pharmacy[]>([]);
	constructor(d: Pharmacy[]) {
		this.pharmacy = d;
	}
	get current() {
		return this.pharmacy;
	}
	addPharmacy(d: Pharmacy) {
		this.pharmacy.push(d);
	}
}
