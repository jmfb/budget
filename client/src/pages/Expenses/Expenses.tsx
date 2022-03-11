import React, { useEffect, useState } from 'react';
import { PageLoading, Button } from '~/components';
import Expense from './Expense';
import ExpenseEditor from './ExpenseEditor';
import { budgetService } from '~/services';
import { IExpense } from '~/models';
import styles from './Expenses.css';

export interface IExpensesProps {
	expenses: IExpense[];
	isSavingExpense: boolean;
	savingExpenseSuccess: boolean;
	saveExpense(expense: IExpense): void;
	deleteExpense(expense: IExpense): void;
	clearExpenseSave(): void;
}

export default function Expenses({
	expenses,
	isSavingExpense,
	savingExpenseSuccess,
	saveExpense,
	deleteExpense,
	clearExpenseSave
}: IExpensesProps) {
	const [showEditor, setShowEditor] = useState(false);
	const [existingExpense, setExistingExpense] = useState<IExpense>(null);
	const [isSaving, setIsSaving] = useState(false);

	const handleAddClicked = () => {
		setShowEditor(true);
	};

	const createEditClickedHandler = (expense: IExpense) => () => {
		setShowEditor(true);
		setExistingExpense(expense);
	};

	const handleSaveClicked = (expense: IExpense) => {
		setIsSaving(true);
		saveExpense(expense);
	};

	const closeEditor = () => {
		setShowEditor(false);
		setExistingExpense(null);
	};

	useEffect(() => {
		if (!isSavingExpense && isSaving) {
			setIsSaving(false);
			if (savingExpenseSuccess) {
				closeEditor();
			}
		}
	}, [isSavingExpense, isSaving, savingExpenseSuccess]);

	if (expenses === null) {
		return <PageLoading message='Loading expenses' />;
	}

	const expensesByCategory = expenses.reduce((map, expense) => {
		const grouping = map[expense.category];
		if (grouping === undefined) {
			map[expense.category] = [expense];
		} else {
			grouping.push(expense);
		}
		return map;
	}, {} as Record<string, IExpense[]>);

	const weeklyExpenses = budgetService.getWeeklyExpenses(expenses);
	return (
		<div>
			<div className={styles.header}>
				<h2 className={styles.h2}>Expenses</h2>
				<Button className={styles.addButton} onClick={handleAddClicked}>Add</Button>
			</div>
			<h3>{budgetService.format(weeklyExpenses)} every week</h3>
			<div>
				{Object.keys(expensesByCategory).sort((a, b) => a.localeCompare(b)).map(category =>
					<div key={category}>
						<h3>{category}</h3>
						{expensesByCategory[category].map(expense =>
							<Expense
								key={expense.name}
								{...{
									expense,
									isSavingExpense,
									deleteExpense,
									clearExpenseSave
								}}
								onEdit={createEditClickedHandler(expense)}
								/>
						)}
					</div>
				)}
			</div>
			{showEditor &&
				<ExpenseEditor
					{...{
						existingExpense,
						isSavingExpense
					}}
					onSave={handleSaveClicked}
					onCancel={closeEditor}
					/>
			}
		</div>
	);
}
