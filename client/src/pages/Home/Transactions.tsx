import React, { useState, useEffect } from 'react';
import { Switch } from '~/components';
import { PendingItems } from './PendingItems';
import { Transaction } from './Transaction';
import { TransactionEditor } from './TransactionEditor';
import { ITransaction, IIncome, IExpense, IPendingItem } from '~/models';
import styles from './Transactions.module.css';

export interface ITransactionsProps {
	onlyShowNewItems: boolean;
	transactions: ITransaction[];
	incomes: IIncome[];
	expenses: IExpense[];
	pendingItems: IPendingItem[];
	expenseTransactions: Record<string, ITransaction[]>;
	includePendingItems: boolean;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	isSavingPendingItem: boolean;
	savingPendingItemSuccess: boolean;
	setOnlyShowNewItems(value: boolean): void;
	saveTransaction(transaction: ITransaction): void;
	deleteTransaction(transaction: ITransaction): void;
	savePendingItem(pendingItem: IPendingItem): void;
	deletePendingItem(pendingItem: IPendingItem): void;
	clearTransactionSave(): void;
	clearPendingItemSave(): void;
}

export function Transactions({
	onlyShowNewItems,
	transactions,
	incomes,
	expenses,
	pendingItems,
	expenseTransactions,
	includePendingItems,
	isSavingTransaction,
	savingTransactionSuccess,
	isSavingPendingItem,
	savingPendingItemSuccess,
	setOnlyShowNewItems,
	saveTransaction,
	deleteTransaction,
	savePendingItem,
	deletePendingItem,
	clearTransactionSave,
	clearPendingItemSave
}: ITransactionsProps) {
	const [showEditor, setShowEditor] = useState(false);
	const [existingTransaction, setExistingTransaction] =
		useState<ITransaction>(null);
	const [isSaving, setIsSaving] = useState(false);

	const transactionsByDate = transactions
		.filter(
			transaction =>
				!onlyShowNewItems ||
				(!transaction.expenseName &&
					!transaction.incomeName &&
					!transaction.category)
		)
		.reduce((map, transaction) => {
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
		<div>
			{includePendingItems && (
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
			)}
			<div className={styles.onlyShowNewItems}>
				<Switch
					checked={onlyShowNewItems}
					onChange={setOnlyShowNewItems}>
					Only show new items
				</Switch>
			</div>
			{Object.keys(transactionsByDate)
				.sort((a, b) => -a.localeCompare(b))
				.map(date => (
					<div key={date}>
						<div className={styles.date}>{date}</div>
						{transactionsByDate[date]
							.sort((a, b) => a.id - b.id)
							.sort((a, b) => a.amount - b.amount)
							.map(transaction => (
								<Transaction
									key={transaction.id}
									{...{
										transaction,
										incomes,
										expenses,
										expenseTransactions
									}}
									onEdit={createEditClickedHandler(
										transaction
									)}
								/>
							))}
					</div>
				))}
			{showEditor && (
				<TransactionEditor
					{...{
						incomes,
						expenses,
						isSavingTransaction,
						savingTransactionSuccess,
						deleteTransaction,
						clearTransactionSave
					}}
					transaction={existingTransaction}
					onSave={handleSaveClicked}
					onCancel={closeEditor}
				/>
			)}
		</div>
	);
}
