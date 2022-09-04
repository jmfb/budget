import React from 'react';
import { Link } from 'react-router-dom';
import { IExpense } from '~/models';
import { budgetService } from '~/services';
import cx from 'classnames';
import styles from './ExpenseBudget.css';

export interface IExpenseBudgetProps {
	expense: IExpense;
	total: number;
}

export default function ExpenseBudget({ expense, total }: IExpenseBudgetProps) {
	return (
		<Link
			className={styles.root}
			to={`/yearly-expenses/${encodeURIComponent(expense.name)}`}>
			Remaining {expense.name} Budget
			<span
				className={cx(styles.net, {
					[styles.gain]: expense.amount >= total,
					[styles.loss]: expense.amount < total
				})}>
				{budgetService.format(Math.abs(expense.amount - total))}
			</span>
		</Link>
	);
}
