import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { ICreateTransactionRequest, ITransaction } from "~/models";
import { IState } from "./IState";
import { dateService, budgetService } from "~/services";
import { pendingItemsHub, transactionsHub } from "~/api";
import { pendingItemsSlice } from "./pendingItems.slice";
import { transactionsSlice } from "./transactions.slice";
import { parse } from "csv-parse";

export const getAllText = createAsyncThunk(
	"budget/getAllText",
	async (file: File) => {
		return await new Promise<string>((resolve, reject) => {
			try {
				const reader = new FileReader();
				reader.onload = async (event) => {
					try {
						if (event.target) {
							const {
								target: { result },
							} = event;
							resolve((<string>result).trim());
						} else {
							reject(new Error("Null FileReader"));
						}
					} catch (error) {
						reject(error);
					}
				};
				reader.readAsText(file);
			} catch (error) {
				reject(error);
			}
		});
	},
);

export const parseCsv = createAsyncThunk(
	"budget/parseCsv",
	async (fileText: string) => {
		const parser = parse();
		parser.write(fileText);
		parser.end();
		const results = [] as string[][];
		for await (const record of parser) {
			results.push(record);
		}
		return results.slice(1);
	},
);

export const matchedTransaction = createAction<ITransaction>(
	"budget/matchedTransaction",
);

export const mergeTransaction = createAsyncThunk(
	"budget/mergeTransaction",
	async (transaction: ICreateTransactionRequest, { getState, dispatch }) => {
		const {
			auth: { accessToken },
			pendingItems: { pendingItems },
			transactions: { years, transactions },
			budget: { matchedTransactions },
		} = getState() as IState;
		const logs = [];
		logs.push("=".repeat(60));
		logs.push(JSON.stringify(transaction, null, 4));
		const year = dateService.getYear(transaction.date);
		if (!years.includes(year)) {
			logs.push("Skipping transaction; year not loaded");
		} else {
			const dailyTransactions = transactions.filter(
				({ date }) => date === transaction.date,
			);
			const existingTransaction = dailyTransactions.find(
				(second) =>
					budgetService.isSameTransaction(transaction, second) &&
					!matchedTransactions.includes(second),
			);
			if (existingTransaction === undefined) {
				logs.push("No matching transaction found for date");
				logs.push(JSON.stringify(dailyTransactions, null, 4));

				const matchingPendingItem = pendingItems.find(
					(pendingItem) => pendingItem.amount === transaction.amount,
				);
				if (matchingPendingItem) {
					logs.push("Found matching pending item");
					logs.push(JSON.stringify(matchingPendingItem, null, 4));
					await pendingItemsHub.deletePendingItem(
						accessToken,
						matchingPendingItem.id,
					);
					dispatch(
						pendingItemsSlice.actions.deletePendingItem(
							matchingPendingItem.id,
						),
					);
				}

				const newTransactionRequest = {
					...transaction,
					categoryId: matchingPendingItem?.categoryId ?? null,
					expenseId: matchingPendingItem?.expenseId ?? null,
					incomeId: matchingPendingItem?.incomeId ?? null,
					note: matchingPendingItem?.name ?? "",
				};
				const newTransactionId =
					await transactionsHub.createTransaction(
						accessToken,
						newTransactionRequest,
					);
				const newTransaction = await transactionsHub.getTransaction(
					accessToken,
					newTransactionId,
				);
				if (newTransaction === null) {
					throw new Error("Missing transaction after creation");
				}
				dispatch(
					transactionsSlice.actions.createTransaction(newTransaction),
				);
				dispatch(matchedTransaction(newTransaction));
			} else {
				dispatch(matchedTransaction(existingTransaction));
				logs.push("Skipping transaction");
			}
		}
		return logs.join("\n");
	},
);
