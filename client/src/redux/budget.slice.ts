import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	IPendingItem,
	IWeeklyTransactionsByWeekOf,
	ITransaction
} from '~/models';
import {
	getBudget,
	savePendingItem,
	deletePendingItem,
	saveTransaction,
	deleteTransaction,
	getWeeklyTransactions,
	getYearlyExpenses,
	getAllText,
	parseCsv,
	mergeTransaction
} from './budget.actions';
import { dateService } from '~/services';

export interface IBudgetState {
	onlyShowNewItems: boolean;
	isLoadingBudget: boolean;
	pendingItems: IPendingItem[];
	weeklyTransactions: IWeeklyTransactionsByWeekOf;
	isLoadingYearlyExpenses: boolean;
	yearlyExpenses: ITransaction[];
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
	logs: string;
}

const initialState: IBudgetState = {
	onlyShowNewItems: false,
	isLoadingBudget: false,
	pendingItems: null,
	weeklyTransactions: {},
	isLoadingYearlyExpenses: false,
	yearlyExpenses: [],
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
	csvRecords: [],
	logs: ''
};

const slice = createSlice({
	name: 'budget',
	initialState,
	reducers: {
		setOnlyShowNewItems(state, action: PayloadAction<boolean>) {
			state.onlyShowNewItems = action.payload;
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
			state.csvRecords = [];
			state.isMergingTransaction = false;
			state.mergingTransactionSuccess = false;
		},
		clearLogs(state) {
			state.logs = '';
		}
	},
	extraReducers: builder =>
		builder
			.addCase(getBudget.pending, state => {
				state.isLoadingBudget = true;
			})
			.addCase(getBudget.fulfilled, (state, action) => {
				state.isLoadingBudget = false;
				state.pendingItems = action.payload.pendingItems;
				state.weeklyTransactions[action.meta.arg] = {
					isLoading: false,
					weekOf: action.meta.arg,
					transactions: action.payload.weeklyTransactions,
					yearlyExpenseTotals: action.payload.yearlyExpenseTotals
				};
			})
			.addCase(getBudget.rejected, state => {
				state.isLoadingBudget = false;
			})

			.addCase(savePendingItem.pending, state => {
				state.isSavingPendingItem = true;
				state.savingPendingItemSuccess = false;
			})
			.addCase(savePendingItem.fulfilled, (state, action) => {
				state.isSavingPendingItem = false;
				state.savingPendingItemSuccess = true;
				const index = state.pendingItems.findIndex(
					pendingItem => pendingItem.id === action.meta.arg.id
				);
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
				state.pendingItems = state.pendingItems.filter(
					pendingItem => pendingItem.id !== action.meta.arg.id
				);
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
				const { transactions } =
					state.weeklyTransactions[
						dateService.getStartOfWeek(action.meta.arg.date)
					];
				const index = transactions.findIndex(
					transaction =>
						transaction.date === action.meta.arg.date &&
						transaction.id === action.meta.arg.id
				);
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
				const weeklyTransactions =
					state.weeklyTransactions[
						dateService.getStartOfWeek(action.meta.arg.date)
					];
				weeklyTransactions.transactions =
					weeklyTransactions.transactions.filter(
						transaction =>
							transaction.date !== action.meta.arg.date ||
							transaction.id !== action.meta.arg.id
					);
			})
			.addCase(deleteTransaction.rejected, state => {
				state.isDeletingTransaction = false;
				state.deletingTransactionSuccess = false;
			})

			.addCase(getWeeklyTransactions.pending, (state, action) => {
				state.weeklyTransactions[action.meta.arg] = {
					isLoading: true,
					weekOf: action.meta.arg,
					transactions: null,
					yearlyExpenseTotals: null
				};
			})
			.addCase(getWeeklyTransactions.fulfilled, (state, action) => {
				const weeklyTransactions =
					state.weeklyTransactions[action.meta.arg];
				weeklyTransactions.isLoading = false;
				weeklyTransactions.transactions =
					action.payload.weeklyTransactions;
				weeklyTransactions.yearlyExpenseTotals =
					action.payload.yearlyExpenseTotals;
			})
			.addCase(getWeeklyTransactions.rejected, (state, action) => {
				delete state.weeklyTransactions[action.meta.arg];
			})

			.addCase(getYearlyExpenses.pending, state => {
				state.isLoadingYearlyExpenses = true;
				state.yearlyExpenses = [];
			})
			.addCase(getYearlyExpenses.fulfilled, (state, action) => {
				state.isLoadingYearlyExpenses = false;
				state.yearlyExpenses = action.payload;
			})
			.addCase(getYearlyExpenses.rejected, state => {
				state.isLoadingYearlyExpenses = false;
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
				state.csvRecords = [];
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
				state.logs += action.payload.logs + '\n';
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
		savePendingItem,
		deletePendingItem,
		saveTransaction,
		deleteTransaction,
		getWeeklyTransactions,
		getYearlyExpenses,
		getAllText,
		parseCsv,
		mergeTransaction
	}
};
