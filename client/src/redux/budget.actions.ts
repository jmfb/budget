import { createAsyncThunk } from '@reduxjs/toolkit';
import { ITransaction } from '~/models';
import IState from './IState';
import * as hub from './budget.hub';
import { dateService, budgetService } from '~/services';
import { deletePendingItem } from './pendingItems.actions';
import { parse } from 'csv-parse';

export const getBudget = createAsyncThunk(
	'budget/getBudget',
	async (weekOf: string, { getState }) => {
		const {
			auth: { accessToken }
		} = getState() as IState;
		return await hub.getBudget(accessToken, weekOf);
	},
	{
		condition: (weekOf: string, { getState }) => {
			const {
				budget: { isLoadingBudget }
			} = getState() as IState;
			if (isLoadingBudget) {
				return false;
			}
		}
	}
);

export const saveTransaction = createAsyncThunk(
	'budget/saveTransaction',
	async (transaction: ITransaction, { getState }) => {
		const {
			auth: { accessToken }
		} = getState() as IState;
		await hub.saveTransaction(accessToken, transaction);
	}
);

export const deleteTransaction = createAsyncThunk(
	'budget/deleteTransaction',
	async ({ date, id }: ITransaction, { getState }) => {
		const {
			auth: { accessToken }
		} = getState() as IState;
		await hub.deleteTransaction(accessToken, date, id);
	}
);

export const getWeeklyTransactions = createAsyncThunk(
	'budget/getWeeklyTransactions',
	async (weekOf: string, { getState }) => {
		const {
			auth: { accessToken }
		} = getState() as IState;
		return await hub.getWeeklyTransactions(accessToken, weekOf);
	}
);

export const getYearlyExpenses = createAsyncThunk(
	'budget/getYearlyExpenses',
	async (
		{ expense, year }: { expense: string; year: number },
		{ getState }
	) => {
		const {
			auth: { accessToken }
		} = getState() as IState;
		return await hub.getYearlyExpenses(accessToken, expense, year);
	}
);

export const getAllText = createAsyncThunk(
	'budget/getAllText',
	async (file: File) => {
		return await new Promise<string>((resolve, reject) => {
			try {
				const reader = new FileReader();
				reader.onload = async event => {
					try {
						const {
							target: { result }
						} = event;
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
	}
);

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
	}
);

export const mergeTransaction = createAsyncThunk(
	'budget/mergeTransaction',
	async (transaction: ITransaction, { getState, dispatch }) => {
		const {
			auth: { accessToken },
			budget: { weeklyTransactions }
		} = getState() as IState;
		const logs = [];
		logs.push('='.repeat(60));
		logs.push(JSON.stringify(transaction, null, 4));
		const copyOfWeeklyTransactions = { ...weeklyTransactions };
		const weekOf = dateService.getStartOfWeek(transaction.date);
		if (copyOfWeeklyTransactions[weekOf] === undefined) {
			const response = await hub.getWeeklyTransactions(
				accessToken,
				weekOf
			);
			copyOfWeeklyTransactions[weekOf] = {
				weekOf,
				isLoading: false,
				transactions: response.weeklyTransactions,
				yearlyExpenseTotals: response.yearlyExpenseTotals
			};
		}
		const week = copyOfWeeklyTransactions[weekOf];
		const dailyTransactions = week.transactions.filter(
			({ date }) => date === transaction.date
		);
		const existingTransaction = dailyTransactions.find(second =>
			budgetService.isSameTransaction(transaction, second)
		);
		if (existingTransaction === undefined) {
			logs.push('No matching transaction found for date');
			logs.push(JSON.stringify(dailyTransactions, null, 4));
			const newTransaction = {
				...transaction,
				id: Math.max(0, ...dailyTransactions.map(({ id }) => id)) + 1
			};
			await hub.saveTransaction(accessToken, newTransaction);
			copyOfWeeklyTransactions[weekOf] = {
				...week,
				transactions: [...week.transactions, newTransaction]
			};

			const {
				pendingItems: { pendingItems }
			} = getState() as IState;
			const matchingPendingItem = pendingItems.find(
				pendingItem => pendingItem.amount === newTransaction.amount
			);
			if (matchingPendingItem) {
				logs.push('Found matching pending item');
				logs.push(JSON.stringify(matchingPendingItem, null, 4));
				await dispatch(deletePendingItem(matchingPendingItem));
			}
		} else {
			logs.push('Skipping transaction');
		}
		return {
			weeklyTransactions: copyOfWeeklyTransactions,
			logs: logs.join('\n')
		};
	}
);
