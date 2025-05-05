// types.ts
export type PharmacyFlatForm = {
	name: string;
	street: string;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	phone_number: string;
};

export type PharmacyNestedForm = {
	name: string;
	type: string;
	location: {
		street: string;
		city: string;
		state: string;
		postal_code: string;
		country: string;
		phone_number: string;
	};
};
