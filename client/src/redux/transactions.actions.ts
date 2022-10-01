import { createAsyncThunk } from '@reduxjs/toolkit';
import { ITransaction } from '~/models';
import { IState } from './IState';
import * as hub from './transactions.hub';

export const getTransactions = createAsyncThunk(
	'transactions/getTransactions',
	async (weekOf: string, { getState }) => {
		const {
			auth: { accessToken }
		} = getState() as IState;
		return await hub.getTransactions(accessToken, weekOf);
	}
);

export const refreshTransactions = createAsyncThunk(
	'transactions/refreshTransactions',
	async (weekVersions: Record<string, number>, { getState, dispatch }) => {
		const {
			transactions: { weeks }
		} = getState() as IState;
		const weeksToGet = Object.entries(weekVersions)
			.filter(([weekOf, version]) => weeks[weekOf]?.version !== version)
			.map(([weekOf]) => weekOf);
		// TODO: Optimize this
		for (const weekOf of weeksToGet) {
			await dispatch(getTransactions(weekOf));
		}
	}
);

export const saveTransaction = createAsyncThunk(
	'transactions/saveTransaction',
	async (transaction: ITransaction, { getState }) => {
		const {
			auth: { accessToken }
		} = getState() as IState;
		return await hub.putTransaction(accessToken, transaction);
	}
);

export const deleteTransaction = createAsyncThunk(
	'transactions/deleteTransaction',
	async ({ date, id }: ITransaction, { getState }) => {
		const {
			auth: { accessToken }
		} = getState() as IState;
		return await hub.deleteTransaction(accessToken, date, id);
	}
);
