import React, { useState, useEffect } from 'react';
import { PageLoading, Pill, Button } from '~/components';
import { ExpenseEditor } from '~/pages/Expenses/ExpenseEditor';
import { ExpenseTransaction } from './ExpenseTransaction';
import { IExpense, ITransaction } from '~/models';
import { budgetService } from '~/services';
import styles from './YearlyExpenses.css';

export interface IYearlyExpensesProps {
	expense: IExpense;
	isLoading: boolean;
	yearlyExpenses: ITransaction[];
	isSavingExpense: boolean;
	savingExpenseSuccess: boolean;
	saveExpense(expense: IExpense): void;
}

export function YearlyExpenses({
	expense,
	isLoading,
	yearlyExpenses,
	isSavingExpense,
	savingExpenseSuccess,
	saveExpense
}: IYearlyExpensesProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [editingExpense, setEditingExpense] = useState<IExpense>(null);

	useEffect(() => {
		if (!isSavingExpense && isSaving) {
			setIsSaving(false);
			if (savingExpenseSuccess) {
				setIsEditing(false);
			}
		}
	}, [isSavingExpense, isSaving, savingExpenseSuccess]);

	if (!expense) {
		return <PageLoading message='Loading expenses...' />;
	}

	if (isLoading) {
		return <PageLoading message='Loading yearly expenses...' />;
	}

	const total = yearlyExpenses.reduce(
		(total, transaction) => total + transaction.amount,
		0
	);
	const remaining = expense.amount - total;

	const handleEditClicked = () => {
		setIsEditing(true);
		setEditingExpense(expense);
	};
	const handleEditCanceled = () => {
		setIsEditing(false);
		setEditingExpense(null);
	};
	const handleEditSaved = (newExpense: IExpense) => {
		setIsSaving(true);
		setEditingExpense(null);
		saveExpense(newExpense);
	};
	const handleResizeBudgetClicked = () => {
		setIsEditing(true);
		setEditingExpense({
			...expense,
			amount: total
		});
	};

	return (
		<div>
			<h2 className={styles.heading}>
				{expense.name} - {budgetService.format(expense.amount)}
				<Pill
					type='info'
					className={styles.category}>
					{expense.category}
				</Pill>
				<Button
					variant='default'
					className={styles.edit}
					onClick={handleEditClicked}>
					Edit
				</Button>
			</h2>
			{remaining === 0 && (
				<div className={styles.message}>
					<span>Budget has been completely used.</span>
				</div>
			)}
			{remaining > 0 && (
				<div className={styles.message}>
					<span className={styles.under}>
						{budgetService.format(remaining)}
					</span>
					<span>remaining in the budget.</span>
					<Button
						variant='default'
						className={styles.resize}
						onClick={handleResizeBudgetClicked}>
						Shrink Budget
					</Button>
				</div>
			)}
			{remaining < 0 && (
				<div className={styles.message}>
					<span className={styles.over}>
						{budgetService.format(-remaining)}
					</span>
					<span>over budget.</span>
					<Button
						variant='default'
						className={styles.resize}
						onClick={handleResizeBudgetClicked}>
						Grow Budget
					</Button>
				</div>
			)}
			{[...yearlyExpenses]
				.sort(
					(a, b) =>
						a.date.localeCompare(b.date) || a.amount - b.amount
				)
				.map(transaction => (
					<ExpenseTransaction
						key={transaction.id}
						{...{ transaction }}
					/>
				))}
			{isEditing && (
				<ExpenseEditor
					{...{ isSavingExpense }}
					existingExpense={editingExpense}
					onSave={handleEditSaved}
					onCancel={handleEditCanceled}
					mustRemainYearlyExpense
				/>
			)}
		</div>
	);
}
