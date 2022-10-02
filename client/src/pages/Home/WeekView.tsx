import React from 'react';
import { Button, ChevronLeftIcon, ChevronRightIcon } from '~/components';
import { dateService } from '~/services';
import { IWeekState } from '~/redux';
import cx from 'classnames';
import styles from './WeekView.module.css';

export interface IWeekViewProps {
	weekOf: string;
	weeklyTransactions: Record<string, IWeekState>;
	setWeekOf(value: string): void;
}

export function WeekView({
	weekOf,
	weeklyTransactions,
	setWeekOf
}: IWeekViewProps) {
	const endOfWeek = dateService.getEndOfWeek(weekOf);
	const daysOfWeek = dateService.getDaysOfWeek(weekOf);
	const isCurrentWeek = weekOf === dateService.getStartOfCurrentWeek();
	const previousWeek = dateService.addDays(weekOf, -7);
	const isFirstWeek = !weeklyTransactions[previousWeek];

	const handlePreviousClicked = () => {
		setWeekOf(previousWeek);
	};
	const handleNextClicked = () => {
		setWeekOf(dateService.addDays(weekOf, 7));
	};

	return (
		<div className={styles.root}>
			<Button
				variant='default'
				onClick={handlePreviousClicked}
				isDisabled={isFirstWeek}
				className={styles.previous}>
				<ChevronLeftIcon />
			</Button>
			<span>
				<div className={styles.weekRange}>
					{dateService.format(weekOf)} to{' '}
					{dateService.format(endOfWeek)}
				</div>
				<div className={styles.daysOfWeek}>
					{daysOfWeek.map(dayOfWeek => (
						<div
							key={dayOfWeek.day}
							className={cx(styles.dayOfWeek, {
								[styles.past]: dayOfWeek.isPast,
								[styles.today]: dayOfWeek.isToday,
								[styles.future]: dayOfWeek.isFuture
							})}>
							<strong>{dayOfWeek.weekday}</strong>
						</div>
					))}
				</div>
				<div className={styles.daysOfWeek}>
					{daysOfWeek.map(dayOfWeek => (
						<div
							key={dayOfWeek.day}
							className={cx(styles.dayOfWeek, {
								[styles.past]: dayOfWeek.isPast,
								[styles.today]: dayOfWeek.isToday,
								[styles.future]: dayOfWeek.isFuture
							})}>
							{dayOfWeek.day}
						</div>
					))}
				</div>
			</span>
			<Button
				variant='default'
				onClick={handleNextClicked}
				isDisabled={isCurrentWeek}
				className={styles.next}>
				<ChevronRightIcon />
			</Button>
		</div>
	);
}
