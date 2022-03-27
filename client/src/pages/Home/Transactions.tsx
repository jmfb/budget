import React, { useState, useEffect } from 'react';
import Transaction from './Transaction';
import TransactionEditor from './TransactionEditor';
import { ITransaction, IIncome, IExpense } from '~/models';
import styles from './Transactions.css';

export interface ITransactionsProps {
	transactions: ITransaction[];
	incomes: IIncome[];
	expenses: IExpense[];
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	isDeletingTransaction: boolean;
	deletingTransactionSuccess: boolean;
	saveTransaction(transaction: ITransaction): void;
	deleteTransaction(transaction: ITransaction): void;
	clearTransactionSave(): void;
	clearTransactionDelete(): void;
}

export default function Transactions({
	transactions,
	incomes,
	expenses,
	isSavingTransaction,
	savingTransactionSuccess,
	isDeletingTransaction,
	deletingTransactionSuccess,
	saveTransaction,
	deleteTransaction,
	clearTransactionSave,
	clearTransactionDelete
}: ITransactionsProps) {
	const [showEditor, setShowEditor] = useState(false);
	const [existingTransaction, setExistingTransaction] = useState<ITransaction>(null);
	const [isSaving, setIsSaving] = useState(false);

	const transactionsByDate = transactions.reduce((map, transaction) => {
		const grouping = map[transaction.date];
		if (grouping === undefined) {
			map[transaction.date] = [transaction];
		} else {
			grouping.push(transaction);
		}
		return map;
	}, {} as Record<string, ITransaction[]>);

	const createEditClickedHandler = (transaction: ITransaction) => () => {
		setShowEditor(true);
		setExistingTransaction(transaction);
	};

	const closeEditor = () => {
		setShowEditor(false);
		setExistingTransaction(null);
	};

	const handleSaveClicked = (updatedTransaction: ITransaction) => {
		setIsSaving(true);
		saveTransaction(updatedTransaction);
	};

	useEffect(() => {
		if (!isSavingTransaction && isSaving) {
			setIsSaving(false);
			if (savingTransactionSuccess) {
				closeEditor();
			}
		}
	}, [isSaving, isSavingTransaction, savingTransactionSuccess]);

	return (
		<div className={styles.root}>
			{Object.keys(transactionsByDate).sort((a, b) => -a.localeCompare(b)).map(date =>
				<div key={date}>
					<h3>{date}</h3>
					{transactionsByDate[date].map(transaction =>
						<Transaction
							key={transaction.id}
							{...{
								transaction,
								incomes,
								expenses
							}}
							onEdit={createEditClickedHandler(transaction)}
							/>
					)}
				</div>
			)}
			{showEditor &&
				<TransactionEditor
					{...{
						incomes,
						expenses,
						isSavingTransaction,
						isDeletingTransaction,
						deletingTransactionSuccess,
						deleteTransaction,
						clearTransactionDelete
					}}
					transaction={existingTransaction}
					onSave={handleSaveClicked}
					onCancel={closeEditor}
					/>
			}
		</div>
	);
}
