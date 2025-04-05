import { createSlice } from "@reduxjs/toolkit";
import { ITransaction } from "~/models";
import {
	getTransactions,
	refreshTransactions,
	saveTransaction,
	deleteTransaction,
	downloadTransactions,
} from "./transactions.actions";
import { dateService } from "~/services";

export interface IWeekState {
	transactions: ITransaction[];
	isLoading: boolean;
}

export interface ITransactionsState {
	weeks: Record<string, IWeekState>;
	isSaving: boolean;
	wasSuccessful: boolean;
	isDownloading: boolean;
}

const initialState: ITransactionsState = {
	weeks: {},
	isSaving: false,
	wasSuccessful: false,
	isDownloading: false,
};

const slice = createSlice({
	name: "transactions",
	initialState,
	reducers: {
		clearSave(state) {
			state.isSaving = false;
			state.wasSuccessful = false;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(getTransactions.pending, (state, action) => {
				const weekOf = action.meta.arg;
				const week = state.weeks[weekOf];
				if (week) {
					week.isLoading = true;
				} else {
					state.weeks[weekOf] = {
						transactions: [],
						isLoading: true,
					};
				}
			})
			.addCase(getTransactions.fulfilled, (state, action) => {
				const week = state.weeks[action.meta.arg];
				week.isLoading = false;
				week.transactions = action.payload.transactions;
			})
			.addCase(getTransactions.rejected, (state, action) => {
				state.weeks[action.meta.arg].isLoading = false;
			})

			.addCase(saveTransaction.pending, (state) => {
				state.isSaving = true;
			})
			.addCase(saveTransaction.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const updatedTransaction = action.meta.arg;
				const weekOf = dateService.getStartOfWeek(
					updatedTransaction.date,
				);
				const week = state.weeks[weekOf];
				// If we load a transaction outside of the 53 week cache, it does
				// not get stored in state.
				if (!week) {
					return;
				}

				const index = week.transactions.findIndex(
					(transaction) =>
						transaction.date === updatedTransaction.date &&
						transaction.id === updatedTransaction.id,
				);
				if (index === -1) {
					week.transactions.push(updatedTransaction);
				} else {
					week.transactions[index] = updatedTransaction;
				}
			})
			.addCase(saveTransaction.rejected, (state) => {
				state.isSaving = false;
			})
			.addCase(deleteTransaction.pending, (state) => {
				state.isSaving = true;
			})
			.addCase(deleteTransaction.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const deletedTransaction = action.meta.arg;
				const weekOf = dateService.getStartOfWeek(
					deletedTransaction.date,
				);
				const week = state.weeks[weekOf];
				week.transactions = week.transactions.filter(
					(transaction) =>
						transaction.date !== deletedTransaction.date ||
						transaction.id !== deletedTransaction.id,
				);
			})
			.addCase(deleteTransaction.rejected, (state) => {
				state.isSaving = false;
			})

			.addCase(downloadTransactions.pending, (state) => {
				state.isDownloading = true;
			})
			.addCase(downloadTransactions.fulfilled, (state) => {
				state.isDownloading = false;
			})
			.addCase(downloadTransactions.rejected, (state) => {
				state.isDownloading = false;
			}),
});

export const transactionsSlice = {
	...slice,
	actions: {
		...slice.actions,
		getTransactions,
		refreshTransactions,
		saveTransaction,
		deleteTransaction,
		downloadTransactions,
	},
};
