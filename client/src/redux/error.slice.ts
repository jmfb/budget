import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuthenticationUrl, authenticate } from "./auth.actions";
import { getAllText, parseCsv, mergeTransaction } from "./budget.actions";
import {
	refreshExpenses,
	saveExpense,
	deleteExpense,
} from "./expenses.actions";
import { refreshIncomes, saveIncome, deleteIncome } from "./incomes.actions";
import {
	getTransactions,
	refreshTransactions,
	saveTransaction,
	deleteTransaction,
	downloadTransactions,
} from "./transactions.actions";
import { IErrorReport } from "~/models";

export interface IErrorState {
	showError: boolean;
	action?: string;
	context?: string;
	message?: string;
}

const initialState: IErrorState = {
	showError: false,
	action: undefined,
	context: undefined,
	message: undefined,
};

function setErrorState(
	state: IErrorState,
	name: string,
	message: string,
	context?: any,
) {
	state.showError = true;
	state.action = name;
	state.message = message;
	state.context = context ? JSON.stringify(context) : undefined;
}

const slice = createSlice({
	name: "error",
	initialState,
	reducers: {
		dismissError(state) {
			Object.assign(state, initialState);
		},
		reportError(state, action: PayloadAction<IErrorReport>) {
			const { action: errorAction, context, message } = action.payload;
			state.showError = true;
			state.action = errorAction;
			state.context = context;
			state.message = message;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(getAuthenticationUrl.rejected, (state, action) => {
				setErrorState(
					state,
					"Getting authentication URL",
					action.error.message,
				);
			})
			.addCase(authenticate.rejected, (state, action) => {
				setErrorState(state, "Authenticating", action.error.message);
			})
			.addCase(getAllText.rejected, (state, action) => {
				setErrorState(state, "Reading file", action.error.message);
			})
			.addCase(parseCsv.rejected, (state, action) => {
				setErrorState(
					state,
					"Parsing csv records",
					action.error.message,
				);
			})
			.addCase(mergeTransaction.rejected, (state, action) => {
				setErrorState(
					state,
					"Merging transaction",
					action.error.message,
				);
			})

			.addCase(refreshExpenses.rejected, (state, action) => {
				setErrorState(
					state,
					"Refreshing expenses",
					action.error.message,
				);
			})
			.addCase(saveExpense.rejected, (state, action) => {
				setErrorState(state, "Saving expense", action.error.message);
			})
			.addCase(deleteExpense.rejected, (state, action) => {
				setErrorState(state, "Deleting expense", action.error.message);
			})

			.addCase(refreshIncomes.rejected, (state, action) => {
				setErrorState(
					state,
					"Refreshing incomes",
					action.error.message,
				);
			})
			.addCase(saveIncome.rejected, (state, action) => {
				setErrorState(state, "Saving income", action.error.message);
			})
			.addCase(deleteIncome.rejected, (state, action) => {
				setErrorState(state, "Deleting income", action.error.message);
			})

			.addCase(getTransactions.rejected, (state, action) => {
				setErrorState(
					state,
					"Getting transactions",
					action.error.message,
				);
			})
			.addCase(refreshTransactions.rejected, (state, action) => {
				setErrorState(
					state,
					"Refreshing transactions",
					action.error.message,
				);
			})
			.addCase(saveTransaction.rejected, (state, action) => {
				setErrorState(
					state,
					"Saving transaction",
					action.error.message,
				);
			})
			.addCase(deleteTransaction.rejected, (state, action) => {
				setErrorState(
					state,
					"Deleting transaction",
					action.error.message,
				);
			})
			.addCase(downloadTransactions.rejected, (state, action) => {
				setErrorState(
					state,
					"Downloading transactions",
					action.error.message,
				);
			}),
});

export const errorSlice = {
	...slice,
	actions: {
		...slice.actions,
	},
};
