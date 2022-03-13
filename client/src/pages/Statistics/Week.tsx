import React from 'react';
import { budgetService } from '~/services';
import styles from './Week.css';

export interface IWeekProps {
	remainingBudget: number;
	maxUnderBudget: number;
	maxOverBudget: number;
}

export default function Week({
	remainingBudget,
	maxUnderBudget,
	maxOverBudget
}: IWeekProps) {
	return (
		<div>
			{remainingBudget > 0 &&
				<div className={styles.row}>
					<div className={styles.overBox}>
						<div className={styles.overLabel}>Under {budgetService.format(remainingBudget)}</div>
					</div>
					<div className={styles.underBox}>
						<div className={styles.under} style={{ flexGrow: remainingBudget }} />
						<div className={styles.notUnder} style={{ flexGrow: maxUnderBudget - remainingBudget }} />
					</div>
				</div>
			}
			{remainingBudget < 0 &&
				<div className={styles.row}>
					<div className={styles.overBox}>
						<div className={styles.notOver} style={{ flexGrow: -maxOverBudget + remainingBudget }} />
						<div className={styles.over} style={{ flexGrow: -remainingBudget }} />
					</div>
					<div className={styles.underBox}>
						<div className={styles.underLabel}>Over {budgetService.format(-remainingBudget)}</div>
					</div>
				</div>
			}
		</div>
	);
}
