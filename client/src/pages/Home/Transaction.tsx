import React from 'react';
import { Pill } from '~/components';
import { ITransaction, IIncome, IExpense, IExpenseTotals } from '~/models';
import { budgetService } from '~/services';
import styles from './Transaction.css';

export interface ITransactionProps {
	transaction: ITransaction;
	incomes: IIncome[];
	expenses: IExpense[];
	yearlyExpenseTotals: IExpenseTotals;
	weekExpenseTotals: IExpenseTotals;
	onEdit(): void;
}

export default function Transaction({
	transaction,
	incomes,
	expenses,
	yearlyExpenseTotals,
	weekExpenseTotals,
	onEdit
}: ITransactionProps) {
	const {
		amount,
		description,
		category,
		note,
		expenseName,
		incomeName
	} = transaction;
	const discrepancy = budgetService.getDiscrepancy(
		transaction,
		incomes,
		expenses,
		yearlyExpenseTotals,
		weekExpenseTotals);
	return (
		<div className={styles.root} onClick={onEdit}>
			<div className={styles.row}>
				<span className={styles.amount}>{budgetService.format(amount)}</span>
				{discrepancy < 0 &&
					<span className={styles.negativeDiscrepancy}>+{budgetService.format(-discrepancy)}</span>
				}
				{discrepancy > 0 &&
					<span className={styles.positiveDiscrepancy}>-{budgetService.format(discrepancy)}</span>
				}
				{note &&
					<span className={styles.note}>{note}</span>
				}
				{!incomeName && !expenseName && !category &&
					<Pill className={styles.pill} type='new'>New!</Pill>
				}
				{!incomeName && !expenseName && category &&
					<Pill className={styles.pill} type='info'>{category}</Pill>
				}
				{incomeName &&
					<Pill className={styles.pill} type='success'>{incomeName}</Pill>
				}
				{expenseName &&
					<Pill className={styles.pill} type='danger'>{expenseName}</Pill>
				}
			</div>
			<div className={styles.description}>
				{description}
			</div>
		</div>
	);
}
