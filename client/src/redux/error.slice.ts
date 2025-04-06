import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuthenticationUrl, authenticate } from "./auth.actions";
import { getAllText, parseCsv, mergeTransaction } from "./budget.actions";
import { getCategories } from "./categories.actions";
import { getExpenses } from "./expenses.actions";
import { getIncomes } from "./incomes.actions";
import {
	getPreviousYear,
	getRestOfCurrentYear,
	getCurrentWeek,
} from "./transactions.actions";
import { IErrorReport } from "~/models";

export interface IErrorState {
	showError: boolean;
	action: string | undefined;
	context: string | undefined;
	message: string | undefined;
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
	message: string | undefined,
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
			.addCase(getCategories.rejected, (state, action) => {
				setErrorState(
					state,
					"Getting categories",
					action.error.message,
				);
			})
			.addCase(getExpenses.rejected, (state, action) => {
				setErrorState(state, "Getting expenses", action.error.message);
			})
			.addCase(getIncomes.rejected, (state, action) => {
				setErrorState(state, "Getting incomes", action.error.message);
			})
			.addCase(getPreviousYear.rejected, (state, action) => {
				setErrorState(
					state,
					"Getting previous year transactions",
					action.error.message,
				);
			})
			.addCase(getRestOfCurrentYear.rejected, (state, action) => {
				setErrorState(
					state,
					"Getting rest of current year",
					action.error.message,
				);
			})
			.addCase(getCurrentWeek.rejected, (state, action) => {
				setErrorState(
					state,
					"Getting current week of transactions",
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
