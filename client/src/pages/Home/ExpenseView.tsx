import React, { useState } from 'react';
import { Button } from '~/components';
import EditExpenses from './EditExpenses';
import { budgetService } from '~/services';
import { IExpense } from '~/models';
import styles from './ExpenseView.css';

export interface IExpenseViewProps {
	expenses: IExpense[];
	isSavingExpense: boolean;
	savingExpenseSuccess: boolean;
	saveExpense(expense: IExpense): void;
	deleteExpense(expense: IExpense): void;
	clearExpenseSave(): void;
}

export default function ExpenseView({
	expenses,
	isSavingExpense,
	savingExpenseSuccess,
	saveExpense,
	deleteExpense,
	clearExpenseSave
}: IExpenseViewProps) {
	const [editing, setEditing] = useState(false);

	const weeklyExpenses = budgetService.getWeeklyExpenses(expenses);

	const handleEditClicked = () => setEditing(true);
	const handleCancelClicked = () => setEditing(false);

	return (
		<div className={styles.root}>
			Expenses {budgetService.format(weeklyExpenses)}
			<Button className={styles.button} onClick={handleEditClicked}>Edit</Button>
			{editing &&
				<EditExpenses
					{...{
						expenses,
						isSavingExpense,
						savingExpenseSuccess,
						saveExpense,
						deleteExpense,
						clearExpenseSave
					}}
					onClose={handleCancelClicked}
					/>
			}
		</div>
	);
}
