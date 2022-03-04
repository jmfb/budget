import { IDayOfWeek } from '~/models';

export function getStartOfWeek(date: string) {
	const value = parse(date);
	value.setDate(value.getDate() - value.getDay());
	return toString(value);
}

export function getEndOfWeek(weekOf: string) {
	return addDays(weekOf, 6);
}

export function addDays(date: string, days: number) {
	const value = parse(date);
	value.setDate(value.getDate() + days);
	return toString(value);
}

export function getStartOfCurrentWeek() {
	return getStartOfWeek(getToday());
}

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function getDaysOfWeek(weekOf: string): IDayOfWeek[] {
	const today = getToday();
	return [0, 1, 2, 3, 4, 5, 6].map(index => {
		const date = addDays(weekOf, index);
		return {
			day: parse(date).getDate(),
			weekday: weekdays[index],
			isPast: date < today,
			isToday: date === today,
			isFuture: date > today
		};
	});
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

export function format(date: string) {
	return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(parse(date));
}
