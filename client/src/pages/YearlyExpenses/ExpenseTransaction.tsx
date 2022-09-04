import React from 'react';
import styles from './ExpenseTransaction.css';
import { ITransaction } from '~/models';
import { budgetService } from '~/services';

export interface IExpenseTransactionProps {
	transaction: ITransaction;
}

export default function ExpenseTransaction({
	transaction
}: IExpenseTransactionProps) {
	const { amount, note, description, date } = transaction;
	return (
		<div className={styles.root}>
			<div className={styles.row}>
				<div className={styles.date}>{date}</div>
				<div className={styles.amount}>
					{budgetService.format(amount)}
				</div>
				<div className={styles.note}>{note}</div>
			</div>
			<div className={styles.row}>
				<div className={styles.description}>{description}</div>
			</div>
		</div>
	);
}
