import { createSlice } from "@reduxjs/toolkit";
import { IPendingItem } from "~/models";
import {
	refreshPendingItems,
	savePendingItem,
	deletePendingItem,
	downloadPendingItems,
} from "./pendingItems.actions";

export interface IPendingItemsState {
	pendingItems: IPendingItem[];
	isLoading: boolean;
	isSaving: boolean;
	wasSuccessful: boolean;
	isDownloading: boolean;
}

const initialState: IPendingItemsState = {
	pendingItems: [],
	isLoading: false,
	isSaving: false,
	wasSuccessful: false,
	isDownloading: false,
};

const slice = createSlice({
	name: "pendingItems",
	initialState,
	reducers: {
		clearSave(state) {
			state.isSaving = false;
			state.wasSuccessful = false;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(refreshPendingItems.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(refreshPendingItems.fulfilled, (state, action) => {
				state.isLoading = false;
				if (action.payload) {
					state.pendingItems = action.payload.pendingItems;
				}
			})
			.addCase(refreshPendingItems.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(savePendingItem.pending, (state) => {
				state.isSaving = true;
			})
			.addCase(savePendingItem.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const updatedPendingItem = action.meta.arg;
				const index = state.pendingItems.findIndex(
					(pendingItem) => pendingItem.id === updatedPendingItem.id,
				);
				if (index === -1) {
					state.pendingItems.push(updatedPendingItem);
				} else {
					state.pendingItems[index] = updatedPendingItem;
				}
			})
			.addCase(savePendingItem.rejected, (state) => {
				state.isSaving = false;
			})
			.addCase(deletePendingItem.pending, (state) => {
				state.isSaving = true;
			})
			.addCase(deletePendingItem.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const deletedPendingItem = action.meta.arg;
				state.pendingItems = state.pendingItems.filter(
					(pendingItem) => pendingItem.id !== deletedPendingItem.id,
				);
			})
			.addCase(deletePendingItem.rejected, (state) => {
				state.isSaving = false;
			})

			.addCase(downloadPendingItems.pending, (state) => {
				state.isDownloading = true;
			})
			.addCase(downloadPendingItems.fulfilled, (state) => {
				state.isDownloading = false;
			})
			.addCase(downloadPendingItems.rejected, (state) => {
				state.isDownloading = false;
			}),
});

export const pendingItemsSlice = {
	...slice,
	actions: {
		...slice.actions,
		refreshPendingItems,
		savePendingItem,
		deletePendingItem,
		downloadPendingItems,
	},
};
