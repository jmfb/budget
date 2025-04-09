import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICategory } from "~/models";
import { getCategories } from "./categories.thunks";

export interface ICategoriesState {
	isLoading: boolean;
	categories: ICategory[];
	categoryById: Record<number, ICategory>;
}

const initialState: ICategoriesState = {
	isLoading: true,
	categories: [],
	categoryById: {},
};

const slice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		createCategory(state, action: PayloadAction<ICategory>) {
			const category = action.payload;
			state.categories.push(category);
			state.categories.sort((a, b) => a.name.localeCompare(b.name));
			state.categoryById[category.id] = category;
		},
		updateCategory(state, action: PayloadAction<ICategory>) {
			const category = action.payload;
			const index = state.categories.findIndex(
				(other) => other.id === category.id,
			);
			state.categories[index] = category;
			state.categories.sort((a, b) => a.name.localeCompare(b.name));
			state.categoryById[category.id] = category;
		},
		deleteCategory(state, action: PayloadAction<number>) {
			const id = action.payload;
			state.categories = state.categories.filter(
				(category) => category.id !== id,
			);
			delete state.categoryById[id];
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(getCategories.fulfilled, (state, action) => {
				state.isLoading = false;
				state.categories = action.payload;
				state.categoryById = state.categories.reduce(
					(map, category) => {
						map[category.id] = category;
						return map;
					},
					{} as Record<number, ICategory>,
				);
			})
			.addCase(getCategories.rejected, (state) => {
				state.isLoading = false;
			}),
});

export const categoriesSlice = {
	...slice,
	actions: {
		...slice.actions,
		getCategories,
	},
};
