import { budgetService } from "~/services";
import styles from "./Week.module.css";

export interface IWeekProps {
	remainingBudget: number;
	maxUnderBudget: number;
	maxOverBudget: number;
}

export function Week({
	remainingBudget,
	maxUnderBudget,
	maxOverBudget,
}: IWeekProps) {
	const range = Math.max(-maxOverBudget, maxUnderBudget, 1);
	const overage = -remainingBudget;
	return (
		<div>
			{remainingBudget >= 0 && (
				<div className={styles.row}>
					<div className={styles.overBox}>
						<div className={styles.overLabel}>
							Under {budgetService.format(remainingBudget)}
						</div>
					</div>
					<div className={styles.underBox}>
						<div
							className={styles.under}
							style={{ flexGrow: remainingBudget }}
						/>
						<div
							className={styles.notUnder}
							style={{ flexGrow: range - remainingBudget }}
						/>
					</div>
				</div>
			)}
			{remainingBudget < 0 && (
				<div className={styles.row}>
					<div className={styles.overBox}>
						<div
							className={styles.notOver}
							style={{ flexGrow: range - overage }}
						/>
						<div
							className={styles.over}
							style={{ flexGrow: overage }}
						/>
					</div>
					<div className={styles.underBox}>
						<div className={styles.underLabel}>
							Over {budgetService.format(overage)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
