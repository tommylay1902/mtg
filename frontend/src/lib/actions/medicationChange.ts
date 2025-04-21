import type { Action } from 'svelte/action';
import type { MedicationType } from '$lib/types/MedicationType.js';

interface MedicationChangeEventDetail {
	detail: MedicationType[];
}

interface MedicationChangeAttributes {
	'on:medicationchange': (event: CustomEvent<MedicationType[]>) => void;
}

export const medicationChange: Action<
	HTMLElement,
	() => MedicationType[],
	MedicationChangeAttributes
> = (node, getValue) => {
	let previousValue = getValue();
	let frame: number;

	const checkForChanges = () => {
		const currentValue = getValue();
		if (!arraysEqual(currentValue, previousValue)) {
			node.dispatchEvent(
				new CustomEvent<MedicationType[]>('medicationchange', {
					detail: [...currentValue] // Clone array to prevent mutation issues
				})
			);
			previousValue = currentValue;
		}
	};

	const observe = () => {
		checkForChanges();
		frame = requestAnimationFrame(observe);
	};

	frame = requestAnimationFrame(observe);

	return {
		destroy() {
			cancelAnimationFrame(frame);
		},
		update(newGetValue) {
			getValue = newGetValue;
		}
	};
};

// Helper function for deep array comparison
function arraysEqual(a: MedicationType[], b: MedicationType[]): boolean {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	return a.every((item, index) => item.id === b[index]?.id);
}
