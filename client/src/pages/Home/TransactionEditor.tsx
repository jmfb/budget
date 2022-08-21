import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, CategorySelect } from '~/components';
import IncomeSelect from './IncomeSelect';
import ExpenseSelect from './ExpenseSelect';
import ConfirmDelete from './ConfirmDelete';
import { ITransaction, IIncome, IExpense } from '~/models';
import { budgetService } from '~/services';
import styles from './TransactionEditor.css';

export interface ITransactionEditorProps {
	transaction: ITransaction;
	incomes: IIncome[];
	expenses: IExpense[];
	isSavingTransaction: boolean;
	isDeletingTransaction: boolean;
	deletingTransactionSuccess: boolean;
	deleteTransaction(transaction: ITransaction): void;
	clearTransactionDelete(): void;
	onSave(updatedTransaction: ITransaction): void;
	onCancel(): void;
}

export default function TransactionEditor({
	transaction,
	incomes,
	expenses,
	isSavingTransaction,
	isDeletingTransaction,
	deletingTransactionSuccess,
	deleteTransaction,
	clearTransactionDelete,
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

	useEffect(() => {
		if (isDeleting && !isDeletingTransaction) {
			setIsDeleting(false);
			if (deletingTransactionSuccess) {
				onCancel();
			}
			clearTransactionDelete();
		}
	}, [isDeleting, isDeletingTransaction, deletingTransactionSuccess]);

	const { amount, description, date } = transaction;

	const isModificationInProgress = isSavingTransaction || isDeleting;

	return (
		<Modal onClose={onCancel}>
			<h3>{description}</h3>
			<div className={styles.inputs}>
				<div className={styles.amount}>
					{budgetService.format(amount)} on {date}
				</div>
				<CategorySelect
					{...{ category }}
					onChange={setCategory}
				/>
				<Input
					name='Note'
					autoFocus
					value={note}
					onChange={setNote}
				/>
				{!expenseName && (
					<IncomeSelect
						{...{ incomes, incomeName }}
						onChange={setIncomeName}
					/>
				)}
				{!incomeName && (
					<ExpenseSelect
						{...{ expenses, expenseName }}
						onChange={setExpenseName}
					/>
				)}
			</div>
			<hr />
			<div className={styles.buttons}>
				<Button
					onClick={handleDeleteClicked}
					isDisabled={isModificationInProgress}
					isProcessing={isDeleting}
					className={styles.deleteButton}>
					Delete
				</Button>
				<Button
					onClick={handleSaveClicked}
					isDisabled={isModificationInProgress}
					isProcessing={isSavingTransaction}
					className={styles.saveButton}>
					Save
				</Button>
				<Button
					onClick={onCancel}
					isDisabled={isModificationInProgress}>
					Cancel
				</Button>
			</div>
			{isConfirmingDelete && (
				<ConfirmDelete
					onConfirmDelete={handleDeleteConfirmationConfirmed}
					onCancel={handleDeleteConfirmationCanceled}
				/>
			)}
		</Modal>
	);
}
