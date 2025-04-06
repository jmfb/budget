import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRetireCategoryRequest, ITransaction } from "~/models";
import {
	getPreviousYear,
	getRestOfCurrentYear,
	getCurrentWeek,
} from "./transactions.thunks";

export interface ITransactionsState {
	isLoading: boolean;
	years: number[];
	transactions: ITransaction[];
}

const initialState: ITransactionsState = {
	isLoading: true,
	years: [],
	transactions: [],
};

const slice = createSlice({
	name: "transactions",
	initialState,
	reducers: {
		createTransaction(state, action: PayloadAction<ITransaction>) {
			const transaction = action.payload;
			state.transactions.push(transaction);
		},
		updateTransaction(state, action: PayloadAction<ITransaction>) {
			const transaction = action.payload;
			const index = state.transactions.findIndex(
				(other) => other.id === transaction.id,
			);
			state.transactions[index] = transaction;
		},
		deleteTransaction(state, action: PayloadAction<number>) {
			const id = action.payload;
			state.transactions = state.transactions.filter(
				(transaction) => transaction.id !== id,
			);
		},
		retireCategory(state, action: PayloadAction<IRetireCategoryRequest>) {
			const { retireId, replacementId } = action.payload;
			for (const transaction of state.transactions) {
				if (transaction.categoryId === retireId) {
					transaction.categoryId = replacementId;
				}
			}
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(getPreviousYear.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getPreviousYear.fulfilled, (state, action) => {
				state.isLoading = false;
				state.transactions.push(...action.payload);
			})
			.addCase(getPreviousYear.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(getRestOfCurrentYear.fulfilled, (state, action) => {
				state.transactions.push(...action.payload);
			})
			.addCase(getCurrentWeek.fulfilled, (state, action) => {
				state.isLoading = false;
				state.transactions.push(...action.payload);
			})
			.addCase(getCurrentWeek.rejected, (state) => {
				state.isLoading = false;
			}),
});

export const transactionsSlice = {
	...slice,
	actions: {
		...slice.actions,
		getPreviousYear,
		getRestOfCurrentYear,
		getCurrentWeek,
	},
};
