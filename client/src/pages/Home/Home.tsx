import React from 'react';
import { PageLoading } from '~/components';
import WeekView from './WeekView';
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
	isSavingIncome: boolean;
	savingIncomeSuccess: boolean;
	isSavingExpense: boolean;
	savingExpenseSuccess: boolean;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	weekOf: string;
	setWeekOf(value: string): void;
	saveIncome(income: IIncome): void;
	clearIncomeSave(): void;
	saveExpense(expense: IExpense): void;
	clearExpenseSave(): void;
	saveTransaction(transaction: ITransaction): void;
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
	clearIncomeSave,
	saveExpense,
	clearExpenseSave,
	saveTransaction,
	clearTransactionSave,
	getWeeklyTransactions
}: IHomeProps) {
	if (isLoadingBudget) {
		return <PageLoading message='Loading budget...' />;
	}

	return (
		<div>
			<WeekView {...{weekOf, setWeekOf}} />
		</div>
	);
}
