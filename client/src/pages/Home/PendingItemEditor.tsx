import { useState, useEffect } from 'react';
import {
	Modal,
	Button,
	Buttons,
	Input,
	CurrencyInput,
	CategorySelect
} from '~/components';
import { IncomeSelect } from './IncomeSelect';
import { ExpenseSelect } from './ExpenseSelect';
import { IPendingItem, IIncome, IExpense } from '~/models';

export interface IPendingItemEditorProps {
	incomes: IIncome[];
	expenses: IExpense[];
	nextPendingItemId: number;
	existingPendingItem: IPendingItem;
	isSavingPendingItem: boolean;
	savingPendingItemSuccess: boolean;
	deletePendingItem(pendingItem: IPendingItem): void;
	clearPendingItemSave(): void;
	onSave(pendingItem: IPendingItem): void;
	onCancel(): void;
}

export function PendingItemEditor({
	incomes,
	expenses,
	nextPendingItemId,
	existingPendingItem,
	isSavingPendingItem,
	savingPendingItemSuccess,
	deletePendingItem,
	clearPendingItemSave,
	onSave,
	onCancel
}: IPendingItemEditorProps) {
	const [name, setName] = useState(existingPendingItem?.name ?? '');
	const [amount, setAmount] = useState(existingPendingItem?.amount ?? 0);
	const [category, setCategory] = useState(
		existingPendingItem?.category ?? ''
	);
	const [expenseName, setExpenseName] = useState(
		existingPendingItem?.expenseName ?? ''
	);
	const [incomeName, setIncomeName] = useState(
		existingPendingItem?.incomeName ?? ''
	);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isAddingExpense, setIsAddingExpense] = useState(false);
	const [isAddingIncome, setIsAddingIncome] = useState(false);
	const [isAddingCategory, setIsAddingCategory] = useState(false);

	const handleSaveClicked = () => {
		const id = existingPendingItem?.id ?? nextPendingItemId;
		onSave({ id, name, amount, category, expenseName, incomeName });
	};

	const handleDeleteClicked = () => {
		setIsDeleting(true);
		deletePendingItem(existingPendingItem);
	};

	const handleCategoryChanged = (newCategory: string) => {
		setCategory(newCategory);
		setIsAddingCategory(false);
	};

	const handleExpenseNameChanged = (newExpenseName: string) => {
		setExpenseName(newExpenseName);
		setIsAddingExpense(false);
	};

	const handleIncomeNameChanged = (newIncomeName: string) => {
		setIncomeName(newIncomeName);
		setIsAddingIncome(false);
	};

	const handleAddExpenseClicked = () => setIsAddingExpense(true);
	const handleAddIncomeClicked = () => setIsAddingIncome(true);
	const handleAddCategoryClicked = () => setIsAddingCategory(true);

	useEffect(() => {
		if (isDeleting && !isSavingPendingItem) {
			setIsDeleting(false);
			if (savingPendingItemSuccess) {
				onCancel();
			}
			clearPendingItemSave();
		}
	}, [isDeleting, isSavingPendingItem, savingPendingItemSuccess]);

	const isModificationInProgress = isSavingPendingItem || isDeleting;
	const showIncomeSelect = !!incomeName || isAddingIncome;
	const showExpenseSelect = !!expenseName || isAddingExpense;
	const showCategorySelect = !!category || isAddingCategory;

	return (
		<Modal
			onClose={onCancel}
			title={
				existingPendingItem
					? 'Edit Pending Transaction'
					: 'New Pending Transaction'
			}
			deleteButton={
				existingPendingItem && (
					<Button
						variant='danger'
						onClick={handleDeleteClicked}
						isDisabled={isModificationInProgress}
						isProcessing={isDeleting}>
						Delete
					</Button>
				)
			}
			buttons={
				<Buttons>
					<Button
						variant='default'
						onClick={onCancel}
						isDisabled={isModificationInProgress}>
						Cancel
					</Button>
					<Button
						variant='primary'
						onClick={handleSaveClicked}
						isDisabled={isModificationInProgress}
						isProcessing={isSavingPendingItem}>
						Save
					</Button>
				</Buttons>
			}>
			<Input
				name='Name'
				autoFocus
				value={name}
				onChange={setName}
			/>
			<CurrencyInput
				name='Amount'
				value={amount}
				onChange={setAmount}
			/>
			{!showExpenseSelect && !showIncomeSelect && !showCategorySelect && (
				<Buttons>
					<Button
						variant='default'
						onClick={handleAddExpenseClicked}>
						Expense
					</Button>
					<Button
						variant='default'
						onClick={handleAddIncomeClicked}>
						Income
					</Button>
					<Button
						variant='default'
						onClick={handleAddCategoryClicked}>
						Category
					</Button>
				</Buttons>
			)}
			{showCategorySelect && (
				<CategorySelect
					category={category}
					onChange={handleCategoryChanged}
				/>
			)}
			{showIncomeSelect && (
				<IncomeSelect
					incomes={incomes}
					incomeName={incomeName}
					onChange={handleIncomeNameChanged}
				/>
			)}
			{showExpenseSelect && (
				<ExpenseSelect
					expenses={expenses}
					expenseName={expenseName}
					onChange={handleExpenseNameChanged}
				/>
			)}
		</Modal>
	);
}
