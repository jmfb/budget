export function getStartOfWeek(date: string) {
	const value = parse(date);
	value.setDate(value.getDate() - value.getDay());
	return toString(value);
}

export function getStartOfCurrentWeek(date: string) {
	return getStartOfWeek(getToday());
}

export function getToday() {
	return toString(new Date());
}

export function parse(date: string) {
	return new Date(`${date}T00:00:00`);
}

export function toString(date: Date) {
	return date.toISOString().slice(0, 10);
}
