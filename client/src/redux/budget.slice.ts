import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	getAllText,
	parseCsv,
	mergeTransaction,
	matchedTransaction,
} from "./budget.actions";
import { ITransaction } from "~/models";

export interface IBudgetState {
	onlyShowNewItems: boolean;
	isMergingTransaction: boolean;
	mergingTransactionSuccess: boolean;
	isReadingFile: boolean;
	readingFileSuccess: boolean;
	fileText: string;
	isParsingCsv: boolean;
	parsingCsvSuccess: boolean;
	csvRecords: string[][];
	logs: string;
	matchedTransactions: ITransaction[];
}

const initialState: IBudgetState = {
	onlyShowNewItems: false,
	isMergingTransaction: false,
	mergingTransactionSuccess: false,
	isReadingFile: false,
	readingFileSuccess: false,
	fileText: "",
	isParsingCsv: false,
	parsingCsvSuccess: false,
	csvRecords: [],
	logs: "",
	matchedTransactions: [],
};

const slice = createSlice({
	name: "budget",
	initialState,
	reducers: {
		setOnlyShowNewItems(state, action: PayloadAction<boolean>) {
			state.onlyShowNewItems = action.payload;
		},
		clearUpload(state) {
			state.isReadingFile = false;
			state.readingFileSuccess = false;
			state.fileText = "";
			state.isParsingCsv = false;
			state.parsingCsvSuccess = false;
			state.csvRecords = [];
			state.isMergingTransaction = false;
			state.mergingTransactionSuccess = false;
			state.matchedTransactions = [];
		},
		clearLogs(state) {
			state.logs = "";
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(getAllText.pending, (state) => {
				state.isReadingFile = true;
				state.readingFileSuccess = false;
				state.fileText = "";
			})
			.addCase(getAllText.fulfilled, (state, action) => {
				state.isReadingFile = false;
				state.readingFileSuccess = true;
				state.fileText = action.payload;
			})
			.addCase(getAllText.rejected, (state) => {
				state.isReadingFile = false;
				state.readingFileSuccess = false;
			})

			.addCase(parseCsv.pending, (state) => {
				state.isParsingCsv = true;
				state.parsingCsvSuccess = false;
				state.csvRecords = [];
			})
			.addCase(parseCsv.fulfilled, (state, action) => {
				state.isParsingCsv = false;
				state.parsingCsvSuccess = true;
				state.csvRecords = action.payload;
			})
			.addCase(parseCsv.rejected, (state) => {
				state.isParsingCsv = false;
				state.parsingCsvSuccess = false;
			})

			.addCase(mergeTransaction.pending, (state) => {
				state.isMergingTransaction = true;
				state.mergingTransactionSuccess = false;
			})
			.addCase(mergeTransaction.fulfilled, (state, action) => {
				state.isMergingTransaction = false;
				state.mergingTransactionSuccess = true;
				state.logs += action.payload + "\n";
			})
			.addCase(mergeTransaction.rejected, (state) => {
				state.isMergingTransaction = false;
				state.mergingTransactionSuccess = false;
			})
			.addCase(matchedTransaction, (state, action) => {
				state.matchedTransactions.push(action.payload);
			}),
});

export const budgetSlice = {
	...slice,
	actions: {
		...slice.actions,
		getAllText,
		parseCsv,
		mergeTransaction,
	},
};
