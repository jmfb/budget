import React from 'react';
import { Pill } from '~/components';
import { ITransaction } from '~/models';
import { budgetService } from '~/services';
import styles from './Transaction.css';

export interface ITransactionProps {
	transaction: ITransaction;
	onEdit(): void;
}

export default function Transaction({
	transaction,
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
	return (
		<div className={styles.root} onClick={onEdit}>
			<div className={styles.row}>
				<span className={styles.amount}>{budgetService.format(amount)}</span>
				{note &&
					<span className={styles.note}>{note}</span>
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
