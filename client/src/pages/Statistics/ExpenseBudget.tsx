import React from 'react';
import { Link } from 'react-router-dom';
import { IExpense } from '~/models';
import { budgetService } from '~/services';
import cx from 'classnames';
import styles from './ExpenseBudget.module.css';

export interface IExpenseBudgetProps {
	expense: IExpense;
	total: number;
}

export function ExpenseBudget({ expense, total }: IExpenseBudgetProps) {
	return (
		<Link
			className={styles.root}
			to={`/yearly-expenses/${encodeURIComponent(expense.name)}`}>
			Remaining {expense.name} Budget
			<span
				className={cx(
					styles.net,
					expense.amount >= total && styles.gain,
					expense.amount < total && styles.loss
				)}>
				{budgetService.format(Math.abs(expense.amount - total))}
			</span>
		</Link>
	);
}
