import React from 'react';
import { PageLoading } from '~/components';
import WeekView from './WeekView';
import IncomeView from './IncomeView';
import ExpenseView from './ExpenseView';
import BudgetView from './BudgetView';
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
	isSavingIncome: boolean;
	savingIncomeSuccess: boolean;
	isSavingExpense: boolean;
	savingExpenseSuccess: boolean;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	weekOf: string;
	setWeekOf(value: string): void;
	saveIncome(income: IIncome): void;
	deleteIncome(income: IIncome): void;
	clearIncomeSave(): void;
	saveExpense(expense: IExpense): void;
	deleteExpense(expense: IExpense): void;
	clearExpenseSave(): void;
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
	isSavingIncome,
	savingIncomeSuccess,
	isSavingExpense,
	savingExpenseSuccess,
	isSavingTransaction,
	savingTransactionSuccess,
	weekOf,
	setWeekOf,
	saveIncome,
	deleteIncome,
	clearIncomeSave,
	saveExpense,
	deleteExpense,
	clearExpenseSave,
	saveTransaction,
	deleteTransaction,
	clearTransactionSave,
	getWeeklyTransactions
}: IHomeProps) {
	if (isLoadingBudget || incomes === null || expenses === null) {
		return <PageLoading message='Loading budget...' />;
	}

	return (
		<div>
			<WeekView {...{weekOf, weeklyTransactions, setWeekOf, getWeeklyTransactions}} />
			<div className={styles.budgetRow}>
				<div className={styles.income}>
					<IncomeView
						{...{
							incomes,
							isSavingIncome,
							savingIncomeSuccess,
							saveIncome,
							deleteIncome,
							clearIncomeSave
						}}
						/>
				</div>
				<div className={styles.expenses}>
					<ExpenseView
						{...{
							expenses,
							isSavingExpense,
							savingExpenseSuccess,
							saveExpense,
							deleteExpense,
							clearExpenseSave
						}}
						/>
				</div>
				<div className={styles.weeklyBudget}>
					<BudgetView
						{...{
							incomes,
							expenses
						}}
						/>
				</div>
			</div>
		</div>
	);
}
