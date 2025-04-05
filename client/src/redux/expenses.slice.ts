import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExpense, IRetireCategoryRequest } from "~/models";
import { getExpenses } from "./expenses.actions";

export interface IExpensesState {
	isLoading: boolean;
	expenses: IExpense[];
	expenseById: Record<number, IExpense>;
}

const initialState: IExpensesState = {
	isLoading: true,
	expenses: [],
	expenseById: {},
};

const slice = createSlice({
	name: "expenses",
	initialState,
	reducers: {
		createExpense(state, action: PayloadAction<IExpense>) {
			const expense = action.payload;
			state.expenses.push(expense);
			state.expenseById[expense.id] = expense;
		},
		updateExpense(state, action: PayloadAction<IExpense>) {
			const expense = action.payload;
			const index = state.expenses.findIndex(
				(other) => other.id === expense.id,
			);
			state.expenses[index] = expense;
			state.expenseById[expense.id] = expense;
		},
		deleteExpense(state, action: PayloadAction<number>) {
			const id = action.payload;
			state.expenses = state.expenses.filter(
				(expense) => expense.id !== id,
			);
			delete state.expenseById[id];
		},
		retireCategory(state, action: PayloadAction<IRetireCategoryRequest>) {
			const { retireId, replacementId } = action.payload;
			for (const expense of state.expenses) {
				if (expense.categoryId === retireId) {
					expense.categoryId = replacementId;
				}
			}
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(getExpenses.pending, (state) => {
				state.isLoading = true;
				state.expenses = [];
				state.expenseById = {};
			})
			.addCase(getExpenses.fulfilled, (state, action) => {
				state.isLoading = false;
				state.expenses = action.payload;
				state.expenseById = state.expenses.reduce(
					(map, expense) => {
						map[expense.id] = expense;
						return map;
					},
					{} as Record<number, IExpense>,
				);
			})
			.addCase(getExpenses.rejected, (state) => {
				state.isLoading = false;
			}),
});

export const expensesSlice = {
	...slice,
	actions: {
		...slice.actions,
		getExpenses,
	},
};
