import { createAsyncThunk } from '@reduxjs/toolkit';
import { IIncome, IExpense, ITransaction } from '~/models';
import IState from './IState';
import * as hub from './budget.hub';
import { budgetService, dateService } from '~/services';

export const getBudget = createAsyncThunk(
	'budget/getBudget',
	async (weekOf: string, { getState }) => {
		const { auth: { accessToken } } = getState() as IState;
		return await hub.getBudget(accessToken, weekOf);
	}, {
		condition: (weekOf: string, { getState }) => {
			const { budget: { isLoadingBudget, incomes } } = getState() as IState;
			if (isLoadingBudget || incomes !== null) {
				return false;
			}
		}
	});

export const saveIncome = createAsyncThunk('budget/saveIncome', async (income: IIncome, { getState }) => {
	const { auth: { accessToken } } = getState() as IState;
	await hub.saveIncome(accessToken, income);
});

export const deleteIncome = createAsyncThunk('budget/deleteIncome', async ({ name }: IIncome, { getState }) => {
	const { auth: { accessToken } } = getState() as IState;
	await hub.deleteIncome(accessToken, name);
});

export const saveExpense = createAsyncThunk('budget/saveExpense', async (expense: IExpense, { getState }) => {
	const { auth: { accessToken } } = getState() as IState;
	await hub.saveExpense(accessToken, expense);
});

export const deleteExpense = createAsyncThunk('budget/deleteExpense', async ({ name }: IExpense, { getState }) => {
	const { auth: { accessToken } } = getState() as IState;
	await hub.deleteExpense(accessToken, name);
});

export const saveTransaction = createAsyncThunk(
	'budget/saveTransaction',
	async (transaction: ITransaction, { getState }) => {
		const { auth: { accessToken } } = getState() as IState;
		await hub.saveTransaction(accessToken, transaction);
	});

export const deleteTransaction = createAsyncThunk(
	'budget/deleteTransaction',
	async ({ date, id }: ITransaction, { getState }) => {
		const { auth: { accessToken } } = getState() as IState;
		await hub.deleteTransaction(accessToken, date, id);
	});

export const getWeeklyTransactions = createAsyncThunk(
	'budget/getWeeklyTransactions',
	async (weekOf: string, { getState }) => {
		const { auth: { accessToken } } = getState() as IState;
		return await hub.getWeeklyTransactions(accessToken, weekOf);
	});

export const mergeTransactions = createAsyncThunk(
	'budget/mergeTransactions',
	async (transactions: ITransaction[], { getState }) => {
		const {
			auth: { accessToken },
			budget: { weeklyTransactions }
		} = getState() as IState;
		const copyOfWeeklyTransactions = { ...weeklyTransactions };
		const weekOfs = budgetService.getDistinctWeekOfs(transactions);
		for (const weekOf of weekOfs) {
			if (copyOfWeeklyTransactions[weekOf] === undefined) {
				copyOfWeeklyTransactions[weekOf] = {
					weekOf,
					isLoading: false,
					transactions: await hub.getWeeklyTransactions(accessToken, weekOf)
				};
			}
		}
		for (const transaction of transactions) {
			const weekOf = dateService.getStartOfWeek(transaction.date);
			const week = copyOfWeeklyTransactions[weekOf];
			const dailyTransactions = week.transactions
				.filter(({ date }) => date === transaction.date);
			const existingTransaction = dailyTransactions
				.find(({ source, rawText }) => source === transaction.source && rawText === transaction.rawText);
			if (existingTransaction === undefined) {
				const newTransaction = {
					...transaction,
					id: Math.max(0, ...dailyTransactions.map(({ id }) => id)) + 1
					// TODO: Match to incomes/expenses
				};
				await hub.saveTransaction(accessToken, newTransaction);
				week.transactions = [...week.transactions, newTransaction];
			} else if (existingTransaction.amount !== transaction.amount) {
				const updatedTransaction = {
					...existingTransaction,
					amount: transaction.amount
				};
				await hub.saveTransaction(accessToken, updatedTransaction);
				const index = week.transactions.indexOf(existingTransaction);
				week.transactions = [
					...week.transactions.slice(0, index),
					updatedTransaction,
					...week.transactions.slice(index + 1)
				];
			}
		}
		return copyOfWeeklyTransactions;
	});
