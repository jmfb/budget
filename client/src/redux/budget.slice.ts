import { createSlice } from '@reduxjs/toolkit';
import { IIncome, IExpense, IWeeklyTransactionsByWeekOf } from '~/models';
import {
	getBudget,
	saveIncome,
	saveExpense,
	saveTransaction,
	getWeeklyTransactions
} from './budget.actions';
import { dateService } from '~/services';

export interface IBudgetState {
	isLoadingBudget: boolean;
	incomes: IIncome[];
	expenses: IExpense[];
	weeklyTransactions: IWeeklyTransactionsByWeekOf;
	isSavingIncome: boolean;
	savingIncomeSuccess: boolean;
	isSavingExpense: boolean;
	savingExpenseSuccess: boolean;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
}

const initialState: IBudgetState = {
	isLoadingBudget: false,
	incomes: null,
	expenses: null,
	weeklyTransactions: {},
	isSavingIncome: false,
	savingIncomeSuccess: false,
	isSavingExpense: false,
	savingExpenseSuccess: false,
	isSavingTransaction: false,
	savingTransactionSuccess: false
};

const slice = createSlice({
	name: 'budget',
	initialState,
	reducers: {
		clearIncomeSave(state) {
			state.isSavingIncome = false;
			state.savingIncomeSuccess = false;
		},
		clearExpenseSave(state) {
			state.isSavingExpense = false;
			state.savingExpenseSuccess = false;
		},
		clearTransactionSave(state) {
			state.isSavingTransaction = false;
			state.savingTransactionSuccess = false;
		}
	},
	extraReducers: builder => builder
		.addCase(getBudget.pending, state => {
			state.isLoadingBudget = true;
		})
		.addCase(getBudget.fulfilled, (state, action) => {
			state.isLoadingBudget = false;
			state.incomes = action.payload.incomes;
			state.expenses = action.payload.expenses;
			state.weeklyTransactions[action.meta.arg] = {
				isLoading: false,
				weekOf: action.meta.arg,
				transactions: action.payload.weeklyTransactions
			};
		})
		.addCase(getBudget.rejected, state => {
			state.isLoadingBudget = false;
		})

		.addCase(saveIncome.pending, state => {
			state.isSavingIncome = true;
			state.savingIncomeSuccess = false;
		})
		.addCase(saveIncome.fulfilled, (state, action) => {
			state.isSavingIncome = false;
			state.savingIncomeSuccess = true;
			const index = state.incomes.findIndex(income => income.name === action.meta.arg.name);
			if (index === -1) {
				state.incomes.push(action.meta.arg);
			} else {
				state.incomes[index] = action.meta.arg;
			}
		})
		.addCase(saveIncome.rejected, state => {
			state.isSavingIncome = false;
			state.savingIncomeSuccess = false;
		})

		.addCase(saveExpense.pending, state => {
			state.isSavingExpense = true;
			state.savingExpenseSuccess = false;
		})
		.addCase(saveExpense.fulfilled, (state, action) => {
			state.isSavingExpense = false;
			state.savingExpenseSuccess = true;
			const index = state.expenses.findIndex(expense => expense.name === action.meta.arg.name);
			if (index === -1) {
				state.expenses.push(action.meta.arg);
			} else {
				state.expenses[index] = action.meta.arg;
			}
		})
		.addCase(saveExpense.rejected, state => {
			state.isSavingExpense = false;
			state.savingExpenseSuccess = false;
		})

		.addCase(saveTransaction.pending, state => {
			state.isSavingTransaction = true;
			state.savingTransactionSuccess = false;
		})
		.addCase(saveTransaction.fulfilled, (state, action) => {
			state.isSavingTransaction = false;
			state.savingTransactionSuccess = true;
			const { transactions } = state.weeklyTransactions[dateService.getStartOfWeek(action.meta.arg.date)];
			const index = transactions.findIndex(transaction =>
				transaction.date === action.meta.arg.date &&
				transaction.id === action.meta.arg.id);
			if (index === -1) {
				transactions.push(action.meta.arg);
			} else {
				transactions[index] = action.meta.arg;
			}
		})
		.addCase(saveTransaction.rejected, state => {
			state.isSavingTransaction = false;
			state.savingTransactionSuccess = false;
		})

		.addCase(getWeeklyTransactions.pending, (state, action) => {
			state.weeklyTransactions[action.meta.arg] = {
				isLoading: true,
				weekOf: action.meta.arg,
				transactions: null
			};
		})
		.addCase(getWeeklyTransactions.fulfilled, (state, action) => {
			const weeklyTransactions = state.weeklyTransactions[action.meta.arg];
			weeklyTransactions.isLoading = false;
			weeklyTransactions.transactions = action.payload;
		})
		.addCase(getWeeklyTransactions.rejected, (state, action) => {
			delete state.weeklyTransactions[action.meta.arg];
		})
});

export default {
	...slice,
	actions: {
		...slice.actions,
		getBudget,
		saveIncome,
		saveExpense,
		saveTransaction,
		getWeeklyTransactions
	}
};
