import { createSlice } from '@reduxjs/toolkit';
import { IIncome, IExpense, IPendingItem, IWeeklyTransactionsByWeekOf } from '~/models';
import {
	getBudget,
	saveIncome,
	deleteIncome,
	saveExpense,
	deleteExpense,
	savePendingItem,
	deletePendingItem,
	saveTransaction,
	deleteTransaction,
	getWeeklyTransactions,
	getAllText,
	parseCsv,
	mergeTransaction
} from './budget.actions';
import { dateService } from '~/services';

export interface IBudgetState {
	isLoadingBudget: boolean;
	incomes: IIncome[];
	expenses: IExpense[];
	pendingItems: IPendingItem[];
	weeklyTransactions: IWeeklyTransactionsByWeekOf;
	isSavingIncome: boolean;
	savingIncomeSuccess: boolean;
	isSavingExpense: boolean;
	savingExpenseSuccess: boolean;
	isSavingPendingItem: boolean;
	savingPendingItemSuccess: boolean;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	isDeletingTransaction: boolean;
	deletingTransactionSuccess: boolean;
	isMergingTransaction: boolean;
	mergingTransactionSuccess: boolean;
	isReadingFile: boolean;
	readingFileSuccess: boolean;
	fileText: string;
	isParsingCsv: boolean;
	parsingCsvSuccess: boolean;
	csvRecords: string[][];
}

const initialState: IBudgetState = {
	isLoadingBudget: false,
	incomes: null,
	expenses: null,
	pendingItems: null,
	weeklyTransactions: {},
	isSavingIncome: false,
	savingIncomeSuccess: false,
	isSavingExpense: false,
	savingExpenseSuccess: false,
	isSavingPendingItem: false,
	savingPendingItemSuccess: false,
	isSavingTransaction: false,
	savingTransactionSuccess: false,
	isDeletingTransaction: false,
	deletingTransactionSuccess: false,
	isMergingTransaction: false,
	mergingTransactionSuccess: false,
	isReadingFile: false,
	readingFileSuccess: false,
	fileText: null,
	isParsingCsv: false,
	parsingCsvSuccess: false,
	csvRecords: null
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
		clearPendingItemSave(state) {
			state.isSavingPendingItem = false;
			state.savingPendingItemSuccess = false;
		},
		clearTransactionSave(state) {
			state.isSavingTransaction = false;
			state.savingTransactionSuccess = false;
		},
		clearTransactionDelete(state) {
			state.isDeletingTransaction = false;
			state.deletingTransactionSuccess = false;
		},
		clearUpload(state) {
			state.isReadingFile = false;
			state.readingFileSuccess = false;
			state.fileText = null;
			state.isParsingCsv = false;
			state.parsingCsvSuccess = false;
			state.csvRecords = null;
			state.isMergingTransaction = false;
			state.mergingTransactionSuccess = false;
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
			state.pendingItems = action.payload.pendingItems;
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

		.addCase(deleteIncome.pending, state => {
			state.isSavingIncome = true;
			state.savingIncomeSuccess = false;
		})
		.addCase(deleteIncome.fulfilled, (state, action) => {
			state.isSavingIncome = false;
			state.savingIncomeSuccess = true;
			state.incomes = state.incomes.filter(income => income.name !== action.meta.arg.name);
		})
		.addCase(deleteIncome.rejected, state => {
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

		.addCase(deleteExpense.pending, state => {
			state.isSavingExpense = true;
			state.savingExpenseSuccess = false;
		})
		.addCase(deleteExpense.fulfilled, (state, action) => {
			state.isSavingExpense = false;
			state.savingExpenseSuccess = true;
			state.expenses = state.expenses.filter(expense => expense.name !== action.meta.arg.name);
		})
		.addCase(deleteExpense.rejected, state => {
			state.isSavingExpense = false;
			state.savingExpenseSuccess = false;
		})

		.addCase(savePendingItem.pending, state => {
			state.isSavingPendingItem = true;
			state.savingPendingItemSuccess = false;
		})
		.addCase(savePendingItem.fulfilled, (state, action) => {
			state.isSavingPendingItem = false;
			state.savingPendingItemSuccess = true;
			const index = state.pendingItems.findIndex(pendingItem => pendingItem.id === action.meta.arg.id);
			if (index === -1) {
				state.pendingItems.push(action.meta.arg);
			} else {
				state.pendingItems[index] = action.meta.arg;
			}
		})
		.addCase(savePendingItem.rejected, state => {
			state.isSavingPendingItem = false;
			state.savingPendingItemSuccess = false;
		})

		.addCase(deletePendingItem.pending, state => {
			state.isSavingPendingItem = true;
			state.savingPendingItemSuccess = false;
		})
		.addCase(deletePendingItem.fulfilled, (state, action) => {
			state.isSavingPendingItem = false;
			state.savingPendingItemSuccess = true;
			state.pendingItems = state.pendingItems.filter(pendingItem => pendingItem.id !== action.meta.arg.id);
		})
		.addCase(deletePendingItem.rejected, state => {
			state.isSavingPendingItem = false;
			state.savingPendingItemSuccess = false;
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

		.addCase(deleteTransaction.pending, state => {
			state.isDeletingTransaction = true;
			state.deletingTransactionSuccess = false;
		})
		.addCase(deleteTransaction.fulfilled, (state, action) => {
			state.isDeletingTransaction = false;
			state.deletingTransactionSuccess = true;
			const weeklyTransactions = state.weeklyTransactions[dateService.getStartOfWeek(action.meta.arg.date)];
			weeklyTransactions.transactions = weeklyTransactions.transactions
				.filter(transaction =>
					transaction.date !== action.meta.arg.date ||
					transaction.id !== action.meta.arg.id);
		})
		.addCase(deleteTransaction.rejected, state => {
			state.isDeletingTransaction = false;
			state.deletingTransactionSuccess = false;
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

		.addCase(getAllText.pending, state => {
			state.isReadingFile = true;
			state.readingFileSuccess = false;
			state.fileText = null;
		})
		.addCase(getAllText.fulfilled, (state, action) => {
			state.isReadingFile = false;
			state.readingFileSuccess = true;
			state.fileText = action.payload;
		})
		.addCase(getAllText.rejected, state => {
			state.isReadingFile = false;
			state.readingFileSuccess = false;
		})

		.addCase(parseCsv.pending, state => {
			state.isParsingCsv = true;
			state.parsingCsvSuccess = false;
			state.csvRecords = null;
		})
		.addCase(parseCsv.fulfilled, (state, action) => {
			state.isParsingCsv = false;
			state.parsingCsvSuccess = true;
			state.csvRecords = action.payload;
		})
		.addCase(parseCsv.rejected, state => {
			state.isParsingCsv = false;
			state.parsingCsvSuccess = false;
		})

		.addCase(mergeTransaction.pending, state => {
			state.isMergingTransaction = true;
			state.mergingTransactionSuccess = false;
		})
		.addCase(mergeTransaction.fulfilled, (state, action) => {
			state.isMergingTransaction = false;
			state.mergingTransactionSuccess = true;
			state.pendingItems = action.payload.pendingItems;
			state.weeklyTransactions = action.payload.weeklyTransactions;
		})
		.addCase(mergeTransaction.rejected, state => {
			state.isMergingTransaction = false;
			state.mergingTransactionSuccess = false;
		})
});

export default {
	...slice,
	actions: {
		...slice.actions,
		getBudget,
		saveIncome,
		deleteIncome,
		saveExpense,
		deleteExpense,
		savePendingItem,
		deletePendingItem,
		saveTransaction,
		deleteTransaction,
		getWeeklyTransactions,
		getAllText,
		parseCsv,
		mergeTransaction
	}
};
