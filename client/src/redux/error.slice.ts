import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAuthenticationUrl, authenticate } from './auth.actions';
import {
	getBudget,
	saveIncome,
	saveTransaction,
	getWeeklyTransactions,
	getYearlyExpenses,
	getAllText,
	parseCsv,
	mergeTransaction
} from './budget.actions';
import {
	refreshExpenses,
	saveExpense,
	deleteExpense
} from './expenses.actions';
import { IErrorReport } from '~/models';

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
	message: undefined
};

function setErrorState(
	state: IErrorState,
	name: string,
	message: string,
	context?: any
) {
	state.showError = true;
	state.action = name;
	state.message = message;
	state.context = context ? JSON.stringify(context) : undefined;
}

const slice = createSlice({
	name: 'error',
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
		}
	},
	extraReducers: builder =>
		builder
			.addCase(getAuthenticationUrl.rejected, (state, action) => {
				setErrorState(
					state,
					'Getting authentication URL',
					action.error.message
				);
			})
			.addCase(authenticate.rejected, (state, action) => {
				setErrorState(state, 'Authenticating', action.error.message);
			})
			.addCase(getBudget.rejected, (state, action) => {
				setErrorState(state, 'Getting budget', action.error.message);
			})
			.addCase(saveIncome.rejected, (state, action) => {
				setErrorState(state, 'Saving income', action.error.message);
			})
			.addCase(saveTransaction.rejected, (state, action) => {
				setErrorState(
					state,
					'Saving transaction',
					action.error.message
				);
			})
			.addCase(getWeeklyTransactions.rejected, (state, action) => {
				setErrorState(
					state,
					'Getting weekly transactions',
					action.error.message
				);
			})
			.addCase(getYearlyExpenses.rejected, (state, action) => {
				setErrorState(
					state,
					'Getting yearly expenses',
					action.error.message
				);
			})
			.addCase(getAllText.rejected, (state, action) => {
				setErrorState(state, 'Reading file', action.error.message);
			})
			.addCase(parseCsv.rejected, (state, action) => {
				setErrorState(
					state,
					'Parsing csv records',
					action.error.message
				);
			})
			.addCase(mergeTransaction.rejected, (state, action) => {
				setErrorState(
					state,
					'Merging transaction',
					action.error.message
				);
			})

			.addCase(refreshExpenses.rejected, (state, action) => {
				setErrorState(
					state,
					'Refreshing expenses',
					action.error.message
				);
			})
			.addCase(saveExpense.rejected, (state, action) => {
				setErrorState(state, 'Saving expense', action.error.message);
			})
			.addCase(deleteExpense.rejected, (state, action) => {
				setErrorState(state, 'Deleting expense', action.error.message);
			})
});

export default {
	...slice,
	actions: {
		...slice.actions
	}
};
