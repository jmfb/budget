import { createSlice } from "@reduxjs/toolkit";
import { IExpense } from "~/models";
import {
	refreshExpenses,
	saveExpense,
	deleteExpense,
	downloadExpenses,
} from "./expenses.actions";

export interface IExpensesState {
	expenses: IExpense[];
	isLoading: boolean;
	isSaving: boolean;
	wasSuccessful: boolean;
	isDownloading: boolean;
}

const initialState: IExpensesState = {
	expenses: [],
	isLoading: false,
	isSaving: false,
	wasSuccessful: false,
	isDownloading: false,
};

const slice = createSlice({
	name: "expenses",
	initialState,
	reducers: {
		clearSave(state) {
			state.isSaving = false;
			state.wasSuccessful = false;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(refreshExpenses.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(refreshExpenses.fulfilled, (state, action) => {
				state.isLoading = false;
				if (action.payload) {
					state.expenses = action.payload.expenses;
				}
			})
			.addCase(refreshExpenses.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(saveExpense.pending, (state) => {
				state.isSaving = true;
			})
			.addCase(saveExpense.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const updatedExpense = action.meta.arg;
				const index = state.expenses.findIndex(
					(expense) => expense.name === updatedExpense.name,
				);
				if (index === -1) {
					state.expenses.push(updatedExpense);
				} else {
					state.expenses[index] = updatedExpense;
				}
			})
			.addCase(saveExpense.rejected, (state) => {
				state.isSaving = false;
			})
			.addCase(deleteExpense.pending, (state) => {
				state.isSaving = true;
			})
			.addCase(deleteExpense.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const deletedExpense = action.meta.arg;
				state.expenses = state.expenses.filter(
					(expense) => expense.name !== deletedExpense.name,
				);
			})
			.addCase(deleteExpense.rejected, (state) => {
				state.isSaving = false;
			})

			.addCase(downloadExpenses.pending, (state) => {
				state.isDownloading = true;
			})
			.addCase(downloadExpenses.fulfilled, (state) => {
				state.isDownloading = false;
			})
			.addCase(downloadExpenses.rejected, (state) => {
				state.isDownloading = false;
			}),
});

export const expensesSlice = {
	...slice,
	actions: {
		...slice.actions,
		refreshExpenses,
		saveExpense,
		deleteExpense,
		downloadExpenses,
	},
};
