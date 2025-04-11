import { useState } from "react";
import {
	Modal,
	Button,
	Input,
	CurrencyInput,
	CategorySelect,
	HorizontalLayout,
} from "~/components";
import { IncomeSelect } from "./IncomeSelect";
import { ExpenseSelect } from "./ExpenseSelect";
import {
	IPendingItem,
	IIncome,
	IExpense,
	IUpdatePendingItemRequest,
} from "~/models";

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
	const [amount, setAmount] = useState(existingPendingItem?.amount ?? 0);
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

	const handleSaveClicked = () => {
		onSave({ name: name.trim(), amount, categoryId, expenseId, incomeId });
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
						variant="danger"
						onClick={onDelete}
						isDisabled={isModificationInProgress}
						isProcessing={isDeleting}
					>
						Delete
					</Button>
				)
			}
			buttons={
				<>
					<Button
						variant="default"
						onClick={onCancel}
						isDisabled={isModificationInProgress}
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleSaveClicked}
						isDisabled={isModificationInProgress}
						isProcessing={isSaving}
					>
						Save
					</Button>
				</>
			}
		>
			<Input name="Name" autoFocus value={name} onChange={setName} />
			<CurrencyInput name="Amount" value={amount} onChange={setAmount} />
			{!showExpenseSelect && !showIncomeSelect && !showCategorySelect && (
				<HorizontalLayout>
					<Button variant="default" onClick={handleAddExpenseClicked}>
						Expense
					</Button>
					<Button variant="default" onClick={handleAddIncomeClicked}>
						Income
					</Button>
					<Button
						variant="default"
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
