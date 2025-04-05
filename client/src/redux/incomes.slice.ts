import { createSlice } from "@reduxjs/toolkit";
import { IIncome } from "~/models";
import {
	refreshIncomes,
	saveIncome,
	deleteIncome,
	downloadIncomes,
} from "./incomes.actions";

export interface IIncomesState {
	version: number;
	incomes: IIncome[];
	isLoading: boolean;
	isSaving: boolean;
	wasSuccessful: boolean;
	isDownloading: boolean;
}

const initialState: IIncomesState = {
	version: JSON.parse(localStorage.getItem("incomes-version") ?? "") ?? null,
	incomes: JSON.parse(localStorage.getItem("incomes") ?? "") ?? [],
	isLoading: false,
	isSaving: false,
	wasSuccessful: false,
	isDownloading: false,
};

function updateLocalStorage(state: IIncomesState) {
	localStorage.setItem("incomes-version", JSON.stringify(state.version));
	localStorage.setItem("incomes", JSON.stringify(state.incomes));
}

const slice = createSlice({
	name: "incomes",
	initialState,
	reducers: {
		clearSave(state) {
			state.isSaving = false;
			state.wasSuccessful = false;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(refreshIncomes.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(refreshIncomes.fulfilled, (state, action) => {
				state.isLoading = false;
				if (action.payload) {
					state.version = action.payload.version;
					state.incomes = action.payload.incomes;
					updateLocalStorage(state);
				}
			})
			.addCase(refreshIncomes.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(saveIncome.pending, (state) => {
				state.isSaving = true;
			})
			.addCase(saveIncome.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const updatedIncome = action.meta.arg;
				const index = state.incomes.findIndex(
					(income) => income.name === updatedIncome.name,
				);
				if (index === -1) {
					state.incomes.push(updatedIncome);
				} else {
					state.incomes[index] = updatedIncome;
				}
				state.version = action.payload;
				updateLocalStorage(state);
			})
			.addCase(saveIncome.rejected, (state) => {
				state.isSaving = false;
			})
			.addCase(deleteIncome.pending, (state) => {
				state.isSaving = true;
			})
			.addCase(deleteIncome.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const deletedIncome = action.meta.arg;
				state.incomes = state.incomes.filter(
					(income) => income.name !== deletedIncome.name,
				);
				state.version = action.payload;
				updateLocalStorage(state);
			})
			.addCase(deleteIncome.rejected, (state) => {
				state.isSaving = false;
			})

			.addCase(downloadIncomes.pending, (state) => {
				state.isDownloading = true;
			})
			.addCase(downloadIncomes.fulfilled, (state) => {
				state.isDownloading = false;
			})
			.addCase(downloadIncomes.rejected, (state) => {
				state.isDownloading = false;
			}),
});

export const incomesSlice = {
	...slice,
	actions: {
		...slice.actions,
		refreshIncomes,
		saveIncome,
		deleteIncome,
		downloadIncomes,
	},
};
