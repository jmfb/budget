import { configureStore } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { errorSlice } from './error.slice';
import { authSlice } from './auth.slice';
import { diagnosticsSlice } from './diagnostics.slice';
import { budgetSlice } from './budget.slice';
import { expensesSlice } from './expenses.slice';
import { incomesSlice } from './incomes.slice';
import { pendingItemsSlice } from './pendingItems.slice';
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
			[pendingItemsSlice.name]: pendingItemsSlice.reducer
		}
	});
}

export const useAppSelector: TypedUseSelectorHook<IState> = useSelector;
