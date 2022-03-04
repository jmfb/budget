import React from 'react';
import { dateService } from '~/services';
import cx from 'classnames';
import styles from './WeekView.css';

export interface IWeekViewProps {
	weekOf: string;
	setWeekOf(value: string): void;
}

export default function WeekView({
	weekOf,
	setWeekOf
}: IWeekViewProps) {
	const endOfWeek = dateService.getEndOfWeek(weekOf);
	const daysOfWeek = dateService.getDaysOfWeek(weekOf);
	return (
		<div>
			<div>Week of {dateService.format(weekOf)} to {dateService.format(endOfWeek)}</div>
			<div className={styles.daysOfWeek}>
				{daysOfWeek.map(dayOfWeek =>
					<div
						key={dayOfWeek.day}
						className={cx(styles.dayOfWeek, {
							[styles.past]: dayOfWeek.isPast,
							[styles.today]: dayOfWeek.isToday,
							[styles.future]: dayOfWeek.isFuture
						})}>
						<strong>{dayOfWeek.weekday}</strong>
					</div>
				)}
			</div>
			<div className={styles.daysOfWeek}>
				{daysOfWeek.map(dayOfWeek =>
					<div
						key={dayOfWeek.day}
						className={cx(styles.dayOfWeek, {
							[styles.past]: dayOfWeek.isPast,
							[styles.today]: dayOfWeek.isToday,
							[styles.future]: dayOfWeek.isFuture
						})}>
						{dayOfWeek.day}
					</div>
				)}
			</div>
		</div>
	);
}
