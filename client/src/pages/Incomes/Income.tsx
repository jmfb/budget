import React, { useState, useEffect } from 'react';
import { Button } from '~/components';
import { IIncome } from '~/models';
import { budgetService } from '~/services';
import styles from './Income.css';

export interface IIncomeProps {
	income: IIncome;
	isSavingIncome: boolean;
	deleteIncome(income: IIncome): void;
	clearIncomeSave(): void;
	onEdit(): void;
}

export function Income({
	income,
	isSavingIncome,
	deleteIncome,
	clearIncomeSave,
	onEdit
}: IIncomeProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const { name, amount, weeksInterval } = income;
	const interval =
		weeksInterval === 1 ? 'every week' : `every ${weeksInterval} weeks`;

	useEffect(() => {
		if (!isSavingIncome && isDeleting) {
			setIsDeleting(false);
			clearIncomeSave();
		}
	}, [isSavingIncome, isDeleting]);

	const handleDeleteClicked = () => {
		setIsDeleting(true);
		deleteIncome(income);
	};

	return (
		<div className={styles.root}>
			<span className={styles.text}>
				{name} - {budgetService.format(amount)} {interval}
			</span>
			<Button
				variant='default'
				className={styles.editButton}
				onClick={onEdit}>
				Edit
			</Button>
			<Button
				variant='danger'
				onClick={handleDeleteClicked}
				isProcessing={isDeleting}
				isDisabled={isSavingIncome}>
				Delete
			</Button>
		</div>
	);
}
