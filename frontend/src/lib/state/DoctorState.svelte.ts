import type { Doctor } from '$lib/types/Doctor.js';

export class DoctorState {
	doctors = $state<Doctor[]>([]);
	constructor(d: Doctor[]) {
		this.doctors = d;
	}
	get current() {
		return this.doctors;
	}
	addDoctor(d: Doctor) {
		this.doctors.push(d);
	}
}
