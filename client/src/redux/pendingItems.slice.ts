import { createSlice } from '@reduxjs/toolkit';
import { IPendingItem } from '~/models';
import {
	refreshPendingItems,
	savePendingItem,
	deletePendingItem
} from './pendingItems.actions';

export interface IPendingItemsState {
	version: number;
	pendingItems: IPendingItem[];
	isLoading: boolean;
	isSaving: boolean;
	wasSuccessful: boolean;
}

const initialState: IPendingItemsState = {
	version: JSON.parse(localStorage.getItem('pending-items-version')) ?? null,
	pendingItems: JSON.parse(localStorage.getItem('pending-items')) ?? [],
	isLoading: false,
	isSaving: false,
	wasSuccessful: false
};

function updateLocalStorage(state: IPendingItemsState) {
	localStorage.setItem(
		'pending-items-version',
		JSON.stringify(state.version)
	);
	localStorage.setItem('pending-items', JSON.stringify(state.pendingItems));
}

const slice = createSlice({
	name: 'pendingItems',
	initialState,
	reducers: {
		clearSave(state) {
			state.isSaving = false;
			state.wasSuccessful = false;
		}
	},
	extraReducers: builder =>
		builder
			.addCase(refreshPendingItems.pending, state => {
				state.isLoading = true;
			})
			.addCase(refreshPendingItems.fulfilled, (state, action) => {
				state.isLoading = false;
				if (action.payload) {
					state.version = action.payload.version;
					state.pendingItems = action.payload.pendingItems;
					updateLocalStorage(state);
				}
			})
			.addCase(refreshPendingItems.rejected, state => {
				state.isLoading = false;
			})
			.addCase(savePendingItem.pending, state => {
				state.isSaving = true;
			})
			.addCase(savePendingItem.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const updatedPendingItem = action.meta.arg;
				const index = state.pendingItems.findIndex(
					pendingItem => pendingItem.id === updatedPendingItem.id
				);
				if (index === -1) {
					state.pendingItems.push(updatedPendingItem);
				} else {
					state.pendingItems[index] = updatedPendingItem;
				}
				state.version = action.payload;
				updateLocalStorage(state);
			})
			.addCase(savePendingItem.rejected, state => {
				state.isSaving = false;
			})
			.addCase(deletePendingItem.pending, state => {
				state.isSaving = true;
			})
			.addCase(deletePendingItem.fulfilled, (state, action) => {
				state.isSaving = false;
				state.wasSuccessful = true;
				const deletedPendingItem = action.meta.arg;
				state.pendingItems = state.pendingItems.filter(
					pendingItem => pendingItem.id !== deletedPendingItem.id
				);
				state.version = action.payload;
				updateLocalStorage(state);
			})
			.addCase(deletePendingItem.rejected, state => {
				state.isSaving = false;
			})
});

export const pendingItemsSlice = {
	...slice,
	actions: {
		...slice.actions,
		refreshPendingItems,
		savePendingItem,
		deletePendingItem
	}
};
