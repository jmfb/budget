import { createAsyncThunk } from '@reduxjs/toolkit';
import { ITransaction } from '~/models';
import { IState } from './IState';
import { dateService, budgetService } from '~/services';
import { deletePendingItem } from './pendingItems.actions';
import { saveTransaction } from './transactions.actions';
import { parse } from 'csv-parse';

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
			pendingItems: { pendingItems },
			transactions: { weeks }
		} = getState() as IState;
		const logs = [];
		logs.push('='.repeat(60));
		logs.push(JSON.stringify(transaction, null, 4));
		const weekOf = dateService.getStartOfWeek(transaction.date);
		const week = weeks[weekOf];
		if (!week) {
			logs.push('Skipping transaction; not within 53 week cache');
		} else {
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
					id:
						Math.max(0, ...dailyTransactions.map(({ id }) => id)) +
						1
				};
				await dispatch(saveTransaction(newTransaction));

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
		}
		return logs.join('\n');
	}
);
