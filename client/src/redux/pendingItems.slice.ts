import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPendingItem, IRetireCategoryRequest } from "~/models";
import { getPendingItems } from "./pendingItems.thunks";

export interface IPendingItemsState {
	isLoading: boolean;
	pendingItems: IPendingItem[];
}

const initialState: IPendingItemsState = {
	isLoading: true,
	pendingItems: [],
};

const slice = createSlice({
	name: "pendingItems",
	initialState,
	reducers: {
		createPendingItem(state, action: PayloadAction<IPendingItem>) {
			const pendingItem = action.payload;
			state.pendingItems.push(pendingItem);
		},
		updatePendingItem(state, action: PayloadAction<IPendingItem>) {
			const pendingItem = action.payload;
			const index = state.pendingItems.findIndex(
				(other) => other.id === pendingItem.id,
			);
			state.pendingItems[index] = pendingItem;
		},
		deletePendingItem(state, action: PayloadAction<number>) {
			const id = action.payload;
			state.pendingItems = state.pendingItems.filter(
				(pendingItem) => pendingItem.id !== id,
			);
		},
		retireCategory(state, action: PayloadAction<IRetireCategoryRequest>) {
			const { retireId, replacementId } = action.payload;
			for (const pendingItem of state.pendingItems) {
				if (pendingItem.categoryId === retireId) {
					pendingItem.categoryId = replacementId;
				}
			}
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(getPendingItems.fulfilled, (state, action) => {
				state.isLoading = false;
				state.pendingItems = action.payload;
			})
			.addCase(getPendingItems.rejected, (state) => {
				state.isLoading = false;
			}),
});

export const pendingItemsSlice = {
	...slice,
	actions: {
		...slice.actions,
		getPendingItems,
	},
};
