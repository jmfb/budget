import { useState } from "react";
import {
	Modal,
	Input,
	CurrencyInput,
	CategorySelect,
	HorizontalLayout,
} from "~/components";
import { Button } from "@mui/material";
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
		<Modal
			onClose={onCancel}
			title={
				existingPendingItem
					? "Edit Pending Transaction"
					: "New Pending Transaction"
			}
			deleteButton={
				existingPendingItem && (
					<Button
						variant="contained"
						color="error"
						onClick={onDelete}
						disabled={isModificationInProgress}
						loading={isDeleting}
					>
						Delete
					</Button>
				)
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
			<Input name="Name" autoFocus value={name} onChange={setName} />
			<CurrencyInput
				name="Amount"
				value={amountString}
				onChange={setAmountString}
			/>
			{!showExpenseSelect && !showIncomeSelect && !showCategorySelect && (
				<HorizontalLayout>
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
				</HorizontalLayout>
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
		</Modal>
	);
}
