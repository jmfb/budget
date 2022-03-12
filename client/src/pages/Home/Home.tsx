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
import styles from './Home.css';

export interface IHomeProps {
	isLoadingBudget: boolean;
	incomes: IIncome[];
	expenses: IExpense[];
	weeklyTransactions: IWeeklyTransactionsByWeekOf;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	weekOf: string;
	setWeekOf(value: string): void;
	saveTransaction(transaction: ITransaction): void;
	deleteTransaction(transaction: ITransaction): void;
	clearTransactionSave(): void;
	getWeeklyTransactions(weekOf: string): void;
}

export default function Home({
	isLoadingBudget,
	incomes,
	expenses,
	weeklyTransactions,
	isSavingTransaction,
	savingTransactionSuccess,
	weekOf,
	setWeekOf,
	saveTransaction,
	deleteTransaction,
	clearTransactionSave,
	getWeeklyTransactions
}: IHomeProps) {
	if (isLoadingBudget || incomes === null || expenses === null) {
		return <PageLoading message='Loading budget...' />;
	}

	const week = weeklyTransactions[weekOf];
	const isLoadingWeek = week === undefined || week.isLoading;

	return (
		<div>
			<WeekView {...{weekOf, weeklyTransactions, setWeekOf, getWeeklyTransactions}} />
			<div className={styles.budgetRow}>
				<div className={styles.weeklyBudget}>
					<BudgetView
						{...{
							incomes,
							expenses
						}}
						transactions={week?.transactions}
						/>
				</div>
			</div>
			{isLoadingWeek ?
				<PageLoading message='Loading transactions...' /> :
				<Transactions
					{...{
						incomes,
						expenses,
						isSavingTransaction,
						savingTransactionSuccess,
						saveTransaction,
						deleteTransaction,
						clearTransactionSave
					}}
					transactions={week.transactions}
					/>
			}
		</div>
	);
}
