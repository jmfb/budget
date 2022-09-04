import { IDayOfWeek } from '~/models';

export function getCurrentYear() {
	const today = new Date();
	return today.getFullYear();
}

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

export function getStartOfLastWeek() {
	return addDays(getStartOfCurrentWeek(), -7);
}

export function getStartOfLastXWeeks(count: number) {
	let weekOf = getStartOfCurrentWeek();
	const result = [weekOf];
	while (--count > 0) {
		weekOf = addDays(weekOf, -7);
		result.push(weekOf);
	}
	return result;
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
	const today = new Date();
	const englishFormat = new Intl.DateTimeFormat(undefined, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(today);
	const parts = englishFormat.split('/');
	return `${parts[2]}-${parts[0]}-${parts[1]}`;
}

export function parse(date: string) {
	return new Date(`${date}T00:00:00`);
}

export function toString(date: Date) {
	return date.toISOString().slice(0, 10);
}

export function format(date: string) {
	return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
		parse(date)
	);
}
