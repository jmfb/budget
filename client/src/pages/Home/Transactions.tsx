import React, { useState, useEffect } from 'react';
import PendingItems from './PendingItems';
import Transaction from './Transaction';
import TransactionEditor from './TransactionEditor';
import { ITransaction, IIncome, IExpense, IPendingItem } from '~/models';
import styles from './Transactions.css';

export interface ITransactionsProps {
	transactions: ITransaction[];
	incomes: IIncome[];
	expenses: IExpense[];
	pendingItems: IPendingItem[];
	includePendingItems: boolean;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	isDeletingTransaction: boolean;
	deletingTransactionSuccess: boolean;
	isSavingPendingItem: boolean;
	savingPendingItemSuccess: boolean;
	saveTransaction(transaction: ITransaction): void;
	deleteTransaction(transaction: ITransaction): void;
	savePendingItem(pendingItem: IPendingItem): void;
	deletePendingItem(pendingItem: IPendingItem): void;
	clearTransactionSave(): void;
	clearTransactionDelete(): void;
	clearPendingItemSave(): void;
}

export default function Transactions({
	transactions,
	incomes,
	expenses,
	pendingItems,
	includePendingItems,
	isSavingTransaction,
	savingTransactionSuccess,
	isDeletingTransaction,
	isSavingPendingItem,
	savingPendingItemSuccess,
	deletingTransactionSuccess,
	saveTransaction,
	deleteTransaction,
	savePendingItem,
	deletePendingItem,
	clearTransactionSave,
	clearTransactionDelete,
	clearPendingItemSave
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
			{includePendingItems &&
				<PendingItems
					{...{
						pendingItems,
						isSavingPendingItem,
						savingPendingItemSuccess,
						savePendingItem,
						deletePendingItem,
						clearPendingItemSave
					}}
					/>
			}
			{Object.keys(transactionsByDate).sort((a, b) => -a.localeCompare(b)).map(date =>
				<div key={date}>
					<h3>{date}</h3>
					{transactionsByDate[date]
						.sort((a, b) => a.id - b.id)
						.sort((a, b) => a.amount - b.amount)
						.map(transaction =>
							<Transaction
								key={transaction.id}
								{...{
									transaction,
									incomes,
									expenses
								}}
								onEdit={createEditClickedHandler(transaction)}
								/>
						)
					}
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
