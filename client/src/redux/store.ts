import { configureStore } from '@reduxjs/toolkit';
import { errorSlice } from './error.slice';
import { authSlice } from './auth.slice';
import { diagnosticsSlice } from './diagnostics.slice';
import { budgetSlice } from './budget.slice';
import { expensesSlice } from './expenses.slice';
import { incomesSlice } from './incomes.slice';
import { pendingItemsSlice } from './pendingItems.slice';
import { transactionsSlice } from './transactions.slice';
import { IState } from './IState';

export function createStore() {
	return configureStore<IState>({
		reducer: {
			[errorSlice.name]: errorSlice.reducer,
			[authSlice.name]: authSlice.reducer,
			[diagnosticsSlice.name]: diagnosticsSlice.reducer,
			[budgetSlice.name]: budgetSlice.reducer,
			[expensesSlice.name]: expensesSlice.reducer,
			[incomesSlice.name]: incomesSlice.reducer,
			[pendingItemsSlice.name]: pendingItemsSlice.reducer,
			[transactionsSlice.name]: transactionsSlice.reducer
		}
	});
}
