import { configureStore } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import errorSlice from './error.slice';
import authSlice from './auth.slice';
import diagnosticsSlice from './diagnostics.slice';
import IState from './IState';

export function createStore() {
	return configureStore<IState>({
		reducer: {
			[errorSlice.name]: errorSlice.reducer,
			[authSlice.name]: authSlice.reducer,
			[diagnosticsSlice.name]: diagnosticsSlice.reducer
		}
	});
}

export const useAppSelector: TypedUseSelectorHook<IState> = useSelector;
