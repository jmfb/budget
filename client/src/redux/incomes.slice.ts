import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIncome } from "~/models";
import { getIncomes } from "./incomes.thunks";

export interface IIncomesState {
	isLoading: boolean;
	incomes: IIncome[];
	incomeById: Record<number, IIncome>;
}

const initialState: IIncomesState = {
	isLoading: true,
	incomes: [],
	incomeById: {},
};

const slice = createSlice({
	name: "incomes",
	initialState,
	reducers: {
		createIncome(state, action: PayloadAction<IIncome>) {
			const income = action.payload;
			state.incomes.push(income);
			state.incomeById[income.id] = income;
		},
		updateIncome(state, action: PayloadAction<IIncome>) {
			const income = action.payload;
			const index = state.incomes.findIndex(
				(other) => other.id === income.id,
			);
			state.incomes[index] = income;
			state.incomeById[income.id] = income;
		},
		deleteIncome(state, action: PayloadAction<number>) {
			const id = action.payload;
			state.incomes = state.incomes.filter((income) => income.id !== id);
			delete state.incomeById[id];
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(getIncomes.pending, (state) => {
				state.isLoading = true;
				state.incomes = [];
				state.incomeById = {};
			})
			.addCase(getIncomes.fulfilled, (state, action) => {
				state.isLoading = false;
				state.incomes = action.payload;
				state.incomeById = state.incomes.reduce(
					(map, income) => {
						map[income.id] = income;
						return map;
					},
					{} as Record<number, IIncome>,
				);
			})
			.addCase(getIncomes.rejected, (state) => {
				state.isLoading = false;
			}),
});

export const incomesSlice = {
	...slice,
	actions: {
		...slice.actions,
		getIncomes,
	},
};
