import { NavigateNext, NavigateBefore } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { dateService } from "~/services";
import { clsx } from "clsx";
import styles from "./WeekView.module.css";

export interface IWeekViewProps {
	weekOf: string;
	setWeekOf(value: string): void;
}

export function WeekView({ weekOf, setWeekOf }: IWeekViewProps) {
	const endOfWeek = dateService.getEndOfWeek(weekOf);
	const daysOfWeek = dateService.getDaysOfWeek(weekOf);
	const isCurrentWeek = weekOf === dateService.getStartOfCurrentWeek();
	const previousWeek = dateService.addDays(weekOf, -7);

	const handlePreviousClicked = () => {
		setWeekOf(previousWeek);
	};
	const handleNextClicked = () => {
		setWeekOf(dateService.addDays(weekOf, 7));
	};

	return (
		<div className={styles.root}>
			<IconButton
				color="primary"
				size="large"
				onClick={handlePreviousClicked}
				className={styles.previous}
			>
				<NavigateBefore />
			</IconButton>
			<span>
				<div className={styles.weekRange}>
					{dateService.format(weekOf)} to{" "}
					{dateService.format(endOfWeek)}
				</div>
				<div className={styles.daysOfWeek}>
					{daysOfWeek.map((dayOfWeek) => (
						<div
							key={dayOfWeek.day}
							className={clsx(
								styles.dayOfWeek,
								dayOfWeek.isPast && styles.past,
								dayOfWeek.isToday && styles.today,
								dayOfWeek.isFuture && styles.future,
							)}
						>
							<strong>{dayOfWeek.weekday}</strong>
						</div>
					))}
				</div>
				<div className={styles.daysOfWeek}>
					{daysOfWeek.map((dayOfWeek) => (
						<div
							key={dayOfWeek.day}
							className={clsx(
								styles.dayOfWeek,
								dayOfWeek.isPast && styles.past,
								dayOfWeek.isToday && styles.today,
								dayOfWeek.isFuture && styles.future,
							)}
						>
							{dayOfWeek.day}
						</div>
					))}
				</div>
			</span>
			<IconButton
				color="primary"
				size="large"
				onClick={handleNextClicked}
				disabled={isCurrentWeek}
				className={styles.next}
			>
				<NavigateNext />
			</IconButton>
		</div>
	);
}
