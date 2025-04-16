export function formatISODateForHtmlInput(isoString: string) {
	const dateValue = isoString.split('T')[0];
	return dateValue;
}
