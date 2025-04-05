import { createSlice } from "@reduxjs/toolkit";
import { IExpense } from "~/models";
import {
	refreshExpenses,
	saveExpense,
	deleteExpense,
	downloadExpenses,
} from "./expenses.actions";

export interface IExpensesState {
	version: number;
	expenses: IExpense[];
	isLoading: boolean;
	isSaving: boolean;
	wasSuccessful: boolean;
	isDownloading: boolean;
}

const initialState: IExpensesState = {
	version: JSON.parse(localStorage.getItem("expenses-version")) ?? null,
	expenses: JSON.parse(localStorage.getItem("expenses")) ?? [],
	isLoading: false,
	isSaving: false,
	wasSuccessful: false,
	isDownloading: false,
};

function updateLocalStorage(state: IExpensesState) {
	localStorage.setItem("expenses-version", JSON.stringify(state.version));
	localStorage.setItem("expenses", JSON.stringify(state.expenses));
}

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
					state.version = action.payload.version;
					state.expenses = action.payload.expenses;
					updateLocalStorage(state);
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
				state.version = action.payload;
				updateLocalStorage(state);
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
				state.version = action.payload;
				updateLocalStorage(state);
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
