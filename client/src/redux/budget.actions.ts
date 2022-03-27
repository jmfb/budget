import { createAsyncThunk } from '@reduxjs/toolkit';
import { IIncome, IExpense, IPendingItem, ITransaction } from '~/models';
import IState from './IState';
import * as hub from './budget.hub';
import { dateService } from '~/services';
import { parse } from 'csv-parse';

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

export const savePendingItem = createAsyncThunk(
	'budget/savePendingItem',
	async (pendingItem: IPendingItem, { getState }) => {
		const { auth: { accessToken } } = getState() as IState;
		await hub.savePendingItem(accessToken, pendingItem);
	});

export const deletePendingItem = createAsyncThunk(
	'budget/deletePendingItem',
	async ({ id }: IPendingItem, { getState }) => {
		const { auth: { accessToken } } = getState() as IState;
		await hub.deletePendingItem(accessToken, id);
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

export const getAllText = createAsyncThunk(
	'budget/getAllText',
	async (file: File) => {
		return await new Promise<string>((resolve, reject) => {
			try {
				const reader = new FileReader();
				reader.onload = async event => {
					try {
						const { target: { result } } = event;
						resolve((<string>result).trim());
					} catch (error) {
						reject(error);
					}
				};
				reader.readAsText(file);
			} catch (error) {
				reject(error);
			}
		});
	});

export const parseCsv = createAsyncThunk(
	'budget/parseCsv',
	async (fileText: string) => {
		const parser = parse();
		parser.write(fileText);
		parser.end();
		const results = [] as string[][];
		for await (const record of parser) {
			results.push(record);
		}
		return results.slice(1);
	});

export const mergeTransaction = createAsyncThunk(
	'budget/mergeTransaction',
	async (transaction: ITransaction, { getState }) => {
		const {
			auth: { accessToken },
			budget: { weeklyTransactions, pendingItems }
		} = getState() as IState;
		const remainingPendingItems = [...pendingItems];
		const copyOfWeeklyTransactions = { ...weeklyTransactions };
		const weekOf = dateService.getStartOfWeek(transaction.date);
		if (copyOfWeeklyTransactions[weekOf] === undefined) {
			copyOfWeeklyTransactions[weekOf] = {
				weekOf,
				isLoading: false,
				transactions: await hub.getWeeklyTransactions(accessToken, weekOf)
			};
		}
		const week = copyOfWeeklyTransactions[weekOf];
		const dailyTransactions = week.transactions
			.filter(({ date }) => date === transaction.date);
		const existingTransaction = dailyTransactions.find(({ source, rawText }) =>
			source === transaction.source &&
			rawText.trim().toLowerCase() === transaction.rawText.trim().toLowerCase());
		if (existingTransaction === undefined) {
			const newTransaction = {
				...transaction,
				id: Math.max(0, ...dailyTransactions.map(({ id }) => id)) + 1
			};
			await hub.saveTransaction(accessToken, newTransaction);
			copyOfWeeklyTransactions[weekOf] = {
				...week,
				transactions: [...week.transactions, newTransaction]
			};

			const matchingPendingItem = pendingItems.find(pendingItem => pendingItem.amount === newTransaction.amount);
			if (matchingPendingItem) {
				await hub.deletePendingItem(accessToken, matchingPendingItem.id);
				const indexOfPendingItem = pendingItems.indexOf(matchingPendingItem);
				remainingPendingItems.splice(indexOfPendingItem, 1);
			}
		} else if (existingTransaction.amount !== transaction.amount) {
			const updatedTransaction = {
				...existingTransaction,
				amount: transaction.amount
			};
			await hub.saveTransaction(accessToken, updatedTransaction);
			const index = week.transactions.indexOf(existingTransaction);
			copyOfWeeklyTransactions[weekOf] = {
				...week,
				transactions: [
					...week.transactions.slice(0, index),
					updatedTransaction,
					...week.transactions.slice(index + 1)
				]
			};
		}
		return {
			weeklyTransactions: copyOfWeeklyTransactions,
			pendingItems: remainingPendingItems
		};
	});
