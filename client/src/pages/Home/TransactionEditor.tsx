import { useState, useEffect } from 'react';
import { Modal, Button, Buttons, Input, CategorySelect } from '~/components';
import { IncomeSelect } from './IncomeSelect';
import { ExpenseSelect } from './ExpenseSelect';
import { ConfirmDelete } from './ConfirmDelete';
import { ITransaction, IIncome, IExpense } from '~/models';
import { budgetService } from '~/services';

export interface ITransactionEditorProps {
	transaction: ITransaction;
	incomes: IIncome[];
	expenses: IExpense[];
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	deleteTransaction(transaction: ITransaction): void;
	clearTransactionSave(): void;
	onSave(updatedTransaction: ITransaction): void;
	onCancel(): void;
}

export function TransactionEditor({
	transaction,
	incomes,
	expenses,
	isSavingTransaction,
	savingTransactionSuccess,
	deleteTransaction,
	clearTransactionSave,
	onSave,
	onCancel
}: ITransactionEditorProps) {
	const [category, setCategory] = useState(transaction.category ?? '');
	const [note, setNote] = useState(transaction.note ?? '');
	const [expenseName, setExpenseName] = useState(
		transaction.expenseName ?? ''
	);
	const [incomeName, setIncomeName] = useState(transaction.incomeName ?? '');
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isAddingExpense, setIsAddingExpense] = useState(false);
	const [isAddingIncome, setIsAddingIncome] = useState(false);

	const handleSaveClicked = () => {
		onSave({
			...transaction,
			category,
			note,
			expenseName,
			incomeName
		});
	};

	const handleDeleteClicked = () => {
		setIsConfirmingDelete(true);
	};

	const handleDeleteConfirmationCanceled = () => {
		setIsConfirmingDelete(false);
	};

	const handleDeleteConfirmationConfirmed = () => {
		setIsDeleting(true);
		deleteTransaction(transaction);
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

	useEffect(() => {
		if (isDeleting && !isSavingTransaction) {
			setIsDeleting(false);
			if (savingTransactionSuccess) {
				onCancel();
			}
			clearTransactionSave();
		}
	}, [isDeleting, isSavingTransaction, savingTransactionSuccess]);

	const { amount, description, date } = transaction;

	const isModificationInProgress = isSavingTransaction || isDeleting;
	const showIncomeSelect = !!incomeName || isAddingIncome;
	const showExpenseSelect = !!expenseName || isAddingExpense;

	return (
		<Modal
			onClose={onCancel}
			title={description}
			deleteButton={
				<Button
					variant='danger'
					onClick={handleDeleteClicked}
					isDisabled={isModificationInProgress}
					isProcessing={isDeleting}>
					Delete
				</Button>
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
						isProcessing={isSavingTransaction}>
						Save
					</Button>
				</Buttons>
			}>
			<div>
				{budgetService.format(amount)} on {date}
			</div>
			<CategorySelect
				category={category}
				autoFocus
				onChange={setCategory}
			/>
			<Input
				name='Note'
				value={note}
				onChange={setNote}
			/>
			{!showExpenseSelect && !showIncomeSelect && (
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
				</Buttons>
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
			{isConfirmingDelete && (
				<ConfirmDelete
					onConfirmDelete={handleDeleteConfirmationConfirmed}
					onCancel={handleDeleteConfirmationCanceled}
				/>
			)}
		</Modal>
	);
}
