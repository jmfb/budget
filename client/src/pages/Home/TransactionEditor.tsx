import { useState } from "react";
import {
	Modal,
	Input,
	CategorySelect,
	HorizontalLayout,
} from "~/components";
import { Button } from "@mui/material";
import { IncomeSelect } from "./IncomeSelect";
import { ExpenseSelect } from "./ExpenseSelect";
import { ConfirmDelete } from "./ConfirmDelete";
import {
	ITransaction,
	IIncome,
	IExpense,
	IUpdateTransactionRequest,
} from "~/models";
import { budgetService } from "~/services";

export interface ITransactionEditorProps {
	transaction: ITransaction;
	incomes: IIncome[];
	expenses: IExpense[];
	isSaving: boolean;
	isDeleting: boolean;
	onSave(request: IUpdateTransactionRequest): void;
	onDelete(): void;
	onCancel(): void;
}

export function TransactionEditor({
	transaction,
	incomes,
	expenses,
	isSaving,
	isDeleting,
	onSave,
	onDelete,
	onCancel,
}: ITransactionEditorProps) {
	const [categoryId, setCategoryId] = useState(transaction.categoryId);
	const [note, setNote] = useState(transaction.note ?? "");
	const [expenseId, setExpenseId] = useState(transaction.expenseId);
	const [incomeId, setIncomeId] = useState(transaction.incomeId);
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
	const [isAddingExpense, setIsAddingExpense] = useState(false);
	const [isAddingIncome, setIsAddingIncome] = useState(false);

	const handleSaveClicked = () => {
		const { id, ...rest } = transaction;
		void id;
		onSave({
			...rest,
			categoryId,
			note,
			expenseId,
			incomeId,
		});
	};

	const handleDeleteClicked = () => {
		setIsConfirmingDelete(true);
	};
	const handleDeleteConfirmationCanceled = () => {
		setIsConfirmingDelete(false);
	};
	const handleDeleteConfirmationConfirmed = () => {
		setIsConfirmingDelete(false);
		onDelete();
	};

	const handleExpenseIdChanged = (newExpenseId: number | null) => {
		setExpenseId(newExpenseId);
		setIsAddingExpense(false);
	};
	const handleIncomeIdChanged = (newIncomeId: number | null) => {
		setIncomeId(newIncomeId);
		setIsAddingIncome(false);
	};

	const handleAddExpenseClicked = () => setIsAddingExpense(true);
	const handleAddIncomeClicked = () => setIsAddingIncome(true);

	const { amount, description, date } = transaction;

	const isModificationInProgress = isSaving || isDeleting;
	const showIncomeSelect = incomeId !== null || isAddingIncome;
	const showExpenseSelect = expenseId !== null || isAddingExpense;

	return (
		<Modal
			onClose={onCancel}
			title={description}
			deleteButton={
				<Button
					variant="contained"
					color="error"
					onClick={handleDeleteClicked}
					disabled={isModificationInProgress}
					loading={isDeleting}
				>
					Delete
				</Button>
			}
			buttons={
				<>
					<Button
						variant="outlined"
						color="primary"
						onClick={onCancel}
						disabled={isModificationInProgress}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSaveClicked}
						disabled={isModificationInProgress}
						loading={isSaving}
					>
						Save
					</Button>
				</>
			}
		>
			<div>
				{budgetService.format(amount)} on {date}
			</div>
			<CategorySelect
				categoryId={categoryId}
				autoFocus
				onChange={setCategoryId}
			/>
			<Input name="Note" value={note} onChange={setNote} />
			{!showExpenseSelect && !showIncomeSelect && (
				<HorizontalLayout>
					<Button variant="outlined" color="primary" onClick={handleAddExpenseClicked}>
						Expense
					</Button>
					<Button variant="outlined" color="primary" onClick={handleAddIncomeClicked}>
						Income
					</Button>
				</HorizontalLayout>
			)}
			{showIncomeSelect && (
				<IncomeSelect
					incomes={incomes}
					incomeId={incomeId}
					onChange={handleIncomeIdChanged}
				/>
			)}
			{showExpenseSelect && (
				<ExpenseSelect
					expenses={expenses}
					expenseId={expenseId}
					onChange={handleExpenseIdChanged}
				/>
			)}
			{isConfirmingDelete && (
				<ConfirmDelete
					onConfirmDelete={handleDeleteConfirmationConfirmed}
					onCancel={handleDeleteConfirmationCanceled}
				/>
			)}
		</Modal>
	);
}
