import { combineReducers } from "@reduxjs/toolkit";
import { errorSlice } from "./error.slice";
import { authSlice } from "./auth.slice";
import { budgetSlice } from "./budget.slice";
import { expensesSlice } from "./expenses.slice";
import { incomesSlice } from "./incomes.slice";
import { pendingItemsSlice } from "./pendingItems.slice";
import { transactionsSlice } from "./transactions.slice";
import { categoriesSlice } from "./categories.slice";

export const rootReducer = combineReducers({
	[errorSlice.name]: errorSlice.reducer,
	[authSlice.name]: authSlice.reducer,
	[budgetSlice.name]: budgetSlice.reducer,
	[expensesSlice.name]: expensesSlice.reducer,
	[incomesSlice.name]: incomesSlice.reducer,
	[pendingItemsSlice.name]: pendingItemsSlice.reducer,
	[transactionsSlice.name]: transactionsSlice.reducer,
	[categoriesSlice.name]: categoriesSlice.reducer,
});
