import { useState, useEffect } from 'react';
import { Button } from '~/components';
import { IExpense } from '~/models';
import { budgetService } from '~/services';
import styles from './Expense.module.css';

export interface IExpenseProps {
	expense: IExpense;
	isSavingExpense: boolean;
	deleteExpense(expense: IExpense): void;
	clearExpenseSave(): void;
	onEdit(): void;
}

export function Expense({
	expense,
	isSavingExpense,
	deleteExpense,
	clearExpenseSave,
	onEdit
}: IExpenseProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const { name, amount, monthsInterval, isDistributed } = expense;
	const interval = isDistributed
		? monthsInterval === 1
			? 'over a month'
			: `over ${monthsInterval} months`
		: monthsInterval === 1
		? 'every month'
		: `every ${monthsInterval} months`;

	useEffect(() => {
		if (!isSavingExpense && isDeleting) {
			setIsDeleting(false);
			clearExpenseSave();
		}
	}, [isSavingExpense, isDeleting]);

	const handleDeleteClicked = () => {
		setIsDeleting(true);
		deleteExpense(expense);
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
				isDisabled={isSavingExpense}>
				Delete
			</Button>
		</div>
	);
}
