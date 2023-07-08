import React from 'react';
import { Input, PageLoading } from '~/components';
import { Transactions } from '~/pages/Home/Transactions';
import { IExpense, IIncome, ITransaction } from '~/models';
import styles from './Search.module.css';

export interface ISearchProps {
	searchQuery: string;
	isLoading: boolean;
	incomes: IIncome[];
	expenses: IExpense[];
	expenseTransactions: Record<string, ITransaction[]>;
	transactions: ITransaction[];
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	saveTransaction(transaction: ITransaction): void;
	deleteTransaction(transaction: ITransaction): void;
	clearTransactionSave(): void;
	onUpdateSearch(searchQuery: string): void;
}

export function Search({
	searchQuery,
	isLoading,
	incomes,
	expenses,
	expenseTransactions,
	transactions,
	isSavingTransaction,
	savingTransactionSuccess,
	saveTransaction,
	deleteTransaction,
	clearTransactionSave,
	onUpdateSearch
}: ISearchProps) {
	if (isLoading) {
		return <PageLoading />;
	}

	return (
		<div className={styles.root}>
			<Input
				name=''
				autoFocus
				placeholder='Search for transactions...'
				value={searchQuery}
				onChange={onUpdateSearch}
			/>
			{!!searchQuery && transactions.length === 0 && (
				<div className={styles['no-results']}>
					No transactions matched your search.
				</div>
			)}
			<Transactions
				{...{
					transactions,
					incomes,
					expenses,
					expenseTransactions,
					isSavingTransaction,
					savingTransactionSuccess,
					saveTransaction,
					deleteTransaction,
					clearTransactionSave
				}}
				variant='search'
				onlyShowNewItems={false}
				setOnlyShowNewItems={undefined}
				includePendingItems={false}
				pendingItems={[]}
				isSavingPendingItem={false}
				savingPendingItemSuccess={false}
				savePendingItem={undefined}
				deletePendingItem={undefined}
				clearPendingItemSave={undefined}
			/>
		</div>
	);
}
