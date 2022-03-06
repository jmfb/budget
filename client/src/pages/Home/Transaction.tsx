import React from 'react';
import { Button, Pill } from '~/components';
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
		<div className={styles.root}>
			<span className={styles.text}>
				{budgetService.format(amount)} - {description}
				{category &&
					<Pill className={styles.pill} type='info'>{category}</Pill>
				}
				{note &&
					<Pill className={styles.pill} type='info'>{note}</Pill>
				}
				{incomeName &&
					<Pill className={styles.pill} type='success'>{incomeName}</Pill>
				}
				{expenseName &&
					<Pill className={styles.pill} type='danger'>{expenseName}</Pill>
				}
			</span>
			<Button className={styles.editButton} onClick={onEdit}>Edit</Button>
		</div>
	);
}
