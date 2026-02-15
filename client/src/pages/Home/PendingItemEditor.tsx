import { ChangeEvent, useState } from "react";
import { CurrencyInput, CategorySelect } from "~/components";
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
import {
	IPendingItem,
	IIncome,
	IExpense,
	IUpdatePendingItemRequest,
} from "~/models";
import { budgetService } from "~/services";

export interface IPendingItemEditorProps {
	incomes: IIncome[];
	expenses: IExpense[];
	existingPendingItem: IPendingItem | null;
	isSaving: boolean;
	isDeleting: boolean;
	onSave(request: IUpdatePendingItemRequest): void;
	onDelete(): void;
	onCancel(): void;
}

export function PendingItemEditor({
	incomes,
	expenses,
	existingPendingItem,
	isSaving,
	isDeleting,
	onSave,
	onDelete,
	onCancel,
}: IPendingItemEditorProps) {
	const [name, setName] = useState(existingPendingItem?.name ?? "");
	const [amountString, setAmountString] = useState(
		existingPendingItem?.amount.toString() ?? "",
	);
	const [categoryId, setCategoryId] = useState(
		existingPendingItem?.categoryId ?? null,
	);
	const [expenseId, setExpenseId] = useState(
		existingPendingItem?.expenseId ?? null,
	);
	const [incomeId, setIncomeId] = useState(
		existingPendingItem?.incomeId ?? null,
	);
	const [isAddingExpense, setIsAddingExpense] = useState(false);
	const [isAddingIncome, setIsAddingIncome] = useState(false);
	const [isAddingCategory, setIsAddingCategory] = useState(false);

	const parsedAmount = budgetService.parseCurrency(amountString);

	const handleSaveClicked = () => {
		onSave({
			name: name.trim(),
			amount: parsedAmount ?? 0,
			categoryId,
			expenseId,
			incomeId,
		});
	};

	const handleNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.currentTarget.value);
	};
	const handleCategoryIdChanged = (newCategoryId: number | null) => {
		setCategoryId(newCategoryId);
		setIsAddingCategory(false);
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
	const handleAddCategoryClicked = () => setIsAddingCategory(true);

	const isModificationInProgress = isSaving || isDeleting;
	const showIncomeSelect = incomeId !== null || isAddingIncome;
	const showExpenseSelect = expenseId !== null || isAddingExpense;
	const showCategorySelect = categoryId !== null || isAddingCategory;

	return (
		<Dialog open onClose={onCancel}>
			<DialogTitle>
				{existingPendingItem
					? "Edit Pending Transaction"
					: "New Pending Transaction"}
			</DialogTitle>
			<DialogContent>
				<Grid
					container
					direction="column"
					spacing={2}
					style={{ minWidth: "20rem" }}
				>
					<TextField
						label="Name"
						variant="standard"
						autoFocus
						value={name}
						onChange={handleNameChanged}
					/>
					<CurrencyInput
						name="Amount"
						value={amountString}
						onChange={setAmountString}
					/>
					{!showExpenseSelect &&
						!showIncomeSelect &&
						!showCategorySelect && (
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
								<Button
									variant="outlined"
									color="primary"
									onClick={handleAddCategoryClicked}
								>
									Category
								</Button>
							</Grid>
						)}
					{showCategorySelect && (
						<CategorySelect
							categoryId={categoryId}
							onChange={handleCategoryIdChanged}
						/>
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
				</Grid>
			</DialogContent>
			<DialogActions>
				{existingPendingItem && (
					<Button
						variant="contained"
						color="error"
						style={{ marginRight: "auto" }}
						onClick={onDelete}
						disabled={isModificationInProgress}
						loading={isDeleting}
					>
						Delete
					</Button>
				)}
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
