import React from 'react';
import { Button } from '~/components';
import { dateService } from '~/services';
import { IWeeklyTransactionsByWeekOf } from '~/models';
import cx from 'classnames';
import styles from './WeekView.css';

export interface IWeekViewProps {
	weekOf: string;
	weeklyTransactions: IWeeklyTransactionsByWeekOf;
	setWeekOf(value: string): void;
	getWeeklyTransactions(weekOf: string): void;
}

export default function WeekView({
	weekOf,
	weeklyTransactions,
	setWeekOf,
	getWeeklyTransactions
}: IWeekViewProps) {
	const endOfWeek = dateService.getEndOfWeek(weekOf);
	const daysOfWeek = dateService.getDaysOfWeek(weekOf);
	const isCurrentWeek = weekOf === dateService.getStartOfCurrentWeek();

	const handlePreviousClicked = () => {
		const previousWeek = dateService.addDays(weekOf, -7);
		if (weeklyTransactions[previousWeek] === undefined) {
			getWeeklyTransactions(previousWeek);
		}
		setWeekOf(previousWeek);
	};
	const handleNextClicked = () => {
		setWeekOf(dateService.addDays(weekOf, 7));
	};

	return (
		<div className={styles.root}>
			<Button onClick={handlePreviousClicked} className={styles.previous}>Previous</Button>
			<span>
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
			</span>
			<Button onClick={handleNextClicked} isDisabled={isCurrentWeek} className={styles.next}>Next</Button>
		</div>
	);
}
