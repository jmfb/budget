import React from 'react';
import { PageLoading } from '~/components';
import WeekView from './WeekView';
import BudgetView from './BudgetView';
import Transactions from './Transactions';
import {
	IIncome,
	IExpense,
	ITransaction,
	IWeeklyTransactionsByWeekOf
} from '~/models';

export interface IHomeProps {
	isLoadingBudget: boolean;
	incomes: IIncome[];
	expenses: IExpense[];
	weeklyTransactions: IWeeklyTransactionsByWeekOf;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	isDeletingTransaction: boolean;
	deletingTransactionSuccess: boolean;
	weekOf: string;
	setWeekOf(value: string): void;
	saveTransaction(transaction: ITransaction): void;
	deleteTransaction(transaction: ITransaction): void;
	clearTransactionSave(): void;
	clearTransactionDelete(): void;
	getWeeklyTransactions(weekOf: string): void;
}

export default function Home({
	isLoadingBudget,
	incomes,
	expenses,
	weeklyTransactions,
	isSavingTransaction,
	savingTransactionSuccess,
	isDeletingTransaction,
	deletingTransactionSuccess,
	weekOf,
	setWeekOf,
	saveTransaction,
	deleteTransaction,
	clearTransactionSave,
	clearTransactionDelete,
	getWeeklyTransactions
}: IHomeProps) {
	if (isLoadingBudget || incomes === null || expenses === null) {
		return <PageLoading message='Loading budget...' />;
	}

	const week = weeklyTransactions[weekOf];
	const isLoadingWeek = week === undefined || week.isLoading;

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
						transactions={week.transactions}
						/>
					<Transactions
						{...{
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
						}}
						transactions={week.transactions}
						/>
				</>
			}
		</div>
	);
}
