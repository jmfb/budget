import { useState, useEffect } from "react";
import { PageLoading, Pill, Button } from "~/components";
import { ExpenseEditor } from "~/pages/Expenses/ExpenseEditor";
import { ExpenseTransaction } from "./ExpenseTransaction";
import { IExpense, ITransaction, IUpdateExpenseRequest } from "~/models";
import { budgetService } from "~/services";
import styles from "./YearlyExpenses.module.css";

export interface IYearlyExpensesProps {
	expense: IExpense | null;
	categoryName: string;
	yearlyExpenses: ITransaction[];
	isSavingExpense: boolean;
	savingExpenseSuccess: boolean;
	onSave(request: IUpdateExpenseRequest): void;
}

export function YearlyExpenses({
	expense,
	categoryName,
	yearlyExpenses,
	isSavingExpense,
	savingExpenseSuccess,
	onSave,
}: IYearlyExpensesProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [editingExpense, setEditingExpense] = useState<IExpense | null>(null);

	useEffect(() => {
		if (!isSavingExpense && isSaving) {
			setIsSaving(false);
			if (savingExpenseSuccess) {
				setIsEditing(false);
			}
		}
	}, [isSavingExpense, isSaving, savingExpenseSuccess]);

	if (!expense) {
		return <PageLoading message="Loading expenses..." />;
	}

	const total = yearlyExpenses.reduce(
		(total, transaction) => total + transaction.amount,
		0,
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
	const handleEditSaved = (request: IUpdateExpenseRequest) => {
		setIsSaving(true);
		setEditingExpense(null);
		onSave(request);
	};
	const handleResizeBudgetClicked = () => {
		setIsEditing(true);
		setEditingExpense({
			...expense,
			amount: total,
		});
	};

	return (
		<div>
			<h2 className={styles.heading}>
				{expense.name} - {budgetService.format(expense.amount)}
				<Pill type="info" className={styles.category}>
					{categoryName}
				</Pill>
				<Button
					variant="default"
					className={styles.edit}
					onClick={handleEditClicked}
				>
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
						variant="default"
						className={styles.resize}
						onClick={handleResizeBudgetClicked}
					>
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
						variant="default"
						className={styles.resize}
						onClick={handleResizeBudgetClicked}
					>
						Grow Budget
					</Button>
				</div>
			)}
			{[...yearlyExpenses]
				.sort(
					(a, b) =>
						a.date.localeCompare(b.date) || a.amount - b.amount,
				)
				.map((transaction) => (
					<ExpenseTransaction
						key={transaction.id}
						transaction={transaction}
					/>
				))}
			{isEditing && (
				<ExpenseEditor
					isSavingExpense={isSavingExpense}
					existingExpense={editingExpense}
					mustRemainYearlyExpense
					onSave={handleEditSaved}
					onCancel={handleEditCanceled}
				/>
			)}
		</div>
	);
}
