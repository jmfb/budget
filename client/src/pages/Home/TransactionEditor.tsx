import { ChangeEvent, useState } from "react";
import { CategorySelect } from "~/components";
import {
	Grid,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from "@mui/material";
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

	const handleNoteChanged = (event: ChangeEvent<HTMLInputElement>) => {
		setNote(event.currentTarget.value);
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
		<Dialog open onClose={onCancel}>
			<DialogTitle>{description}</DialogTitle>
			<DialogContent>
				<Grid
					container
					direction="column"
					spacing={2}
					style={{ minWidth: "20rem" }}
				>
					<div>
						{budgetService.format(amount)} on {date}
					</div>
					<CategorySelect
						categoryId={categoryId}
						autoFocus
						onChange={setCategoryId}
					/>
					<TextField
						label="Note"
						variant="standard"
						value={note}
						onChange={handleNoteChanged}
					/>
					{!showExpenseSelect && !showIncomeSelect && (
						<Grid container direction="row" spacing={2}>
							<Button
								variant="outlined"
								color="primary"
								onClick={handleAddExpenseClicked}
							>
								Expense
							</Button>
							<Button
								variant="outlined"
								color="primary"
								onClick={handleAddIncomeClicked}
							>
								Income
							</Button>
						</Grid>
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
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					color="error"
					style={{ marginRight: "auto" }}
					onClick={handleDeleteClicked}
					disabled={isModificationInProgress}
					loading={isDeleting}
				>
					Delete
				</Button>
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
			</DialogActions>
		</Dialog>
	);
}
