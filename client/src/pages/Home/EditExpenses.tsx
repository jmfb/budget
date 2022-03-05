import React, { useState, useEffect } from 'react';
import { Button, Modal } from '~/components';
import Expense from './Expense';
import ExpenseEditor from './ExpenseEditor';
import { IExpense } from '~/models';
import styles from './EditExpenses.css';

export interface IEditExpensesProps {
	expenses: IExpense[];
	isSavingExpense: boolean;
	savingExpenseSuccess: boolean;
	saveExpense(expense: IExpense): void;
	deleteExpense(expense: IExpense): void;
	clearExpenseSave(): void;
	onClose(): void;
}

export default function EditExpenses({
	expenses,
	isSavingExpense,
	savingExpenseSuccess,
	saveExpense,
	deleteExpense,
	clearExpenseSave,
	onClose
}: IEditExpensesProps) {
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

	const expensesByCategory = expenses.reduce((map, expense) => {
		const grouping = map[expense.category];
		if (grouping === undefined) {
			map[expense.category] = [expense];
		} else {
			grouping.push(expense);
		}
		return map;
	}, {} as Record<string, IExpense[]>);

	return (
		<Modal {...{onClose}}>
			<h2>Expenses</h2>
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
			<hr />
			<div className={styles.buttons}>
				<Button className={styles.addButton} onClick={handleAddClicked}>Add</Button>
				<Button onClick={onClose}>Close</Button>
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
		</Modal>
	);
}
