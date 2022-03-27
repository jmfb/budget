import React from 'react';
import { PageLoading } from '~/components';
import WeekView from './WeekView';
import BudgetView from './BudgetView';
import Transactions from './Transactions';
import {
	IIncome,
	IExpense,
	ITransaction,
	IPendingItem,
	IWeeklyTransactionsByWeekOf
} from '~/models';
import { dateService } from '~/services';

export interface IHomeProps {
	isLoadingBudget: boolean;
	incomes: IIncome[];
	expenses: IExpense[];
	pendingItems: IPendingItem[];
	weeklyTransactions: IWeeklyTransactionsByWeekOf;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	isDeletingTransaction: boolean;
	deletingTransactionSuccess: boolean;
	isSavingPendingItem: boolean;
	savingPendingItemSuccess: boolean;
	weekOf: string;
	setWeekOf(value: string): void;
	saveTransaction(transaction: ITransaction): void;
	deleteTransaction(transaction: ITransaction): void;
	savePendingItem(pendingItem: IPendingItem): void;
	deletePendingItem(pendingItem: IPendingItem): void;
	clearTransactionSave(): void;
	clearTransactionDelete(): void;
	clearPendingItemSave(): void;
	getWeeklyTransactions(weekOf: string): void;
}

export default function Home({
	isLoadingBudget,
	incomes,
	expenses,
	pendingItems,
	weeklyTransactions,
	isSavingTransaction,
	savingTransactionSuccess,
	isDeletingTransaction,
	deletingTransactionSuccess,
	isSavingPendingItem,
	savingPendingItemSuccess,
	weekOf,
	setWeekOf,
	saveTransaction,
	deleteTransaction,
	savePendingItem,
	deletePendingItem,
	clearTransactionSave,
	clearTransactionDelete,
	clearPendingItemSave,
	getWeeklyTransactions
}: IHomeProps) {
	if (isLoadingBudget || incomes === null || expenses === null) {
		return <PageLoading message='Loading budget...' />;
	}

	const week = weeklyTransactions[weekOf];
	const isLoadingWeek = week === undefined || week.isLoading;
	const includePendingItems = weekOf >= dateService.getStartOfLastWeek();

	return (
		<div>
			<WeekView
				{...{
					weekOf,
					weeklyTransactions,
					setWeekOf,
					getWeeklyTransactions
				}}
				/>
			{isLoadingWeek &&
				<PageLoading message='Loading transactions...' />
			}
			{!isLoadingWeek &&
				<>
					<BudgetView
						{...{
							incomes,
							expenses
						}}
						pendingItems={includePendingItems ? pendingItems : []}
						yearlyExpenseTotals={week.yearlyExpenseTotals}
						transactions={week.transactions}
						/>
					<Transactions
						{...{
							incomes,
							expenses,
							pendingItems,
							includePendingItems,
							isSavingTransaction,
							savingTransactionSuccess,
							isDeletingTransaction,
							deletingTransactionSuccess,
							isSavingPendingItem,
							savingPendingItemSuccess,
							saveTransaction,
							deleteTransaction,
							savePendingItem,
							deletePendingItem,
							clearTransactionSave,
							clearTransactionDelete,
							clearPendingItemSave
						}}
						transactions={week.transactions}
						yearlyExpenseTotals={week.yearlyExpenseTotals}
						/>
				</>
			}
		</div>
	);
}
