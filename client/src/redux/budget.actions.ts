import { createAsyncThunk } from '@reduxjs/toolkit';
import { IIncome, IExpense, ITransaction } from '~/models';
import IState from './IState';
import * as hub from './budget.hub';

export const getBudget = createAsyncThunk('budget/getBudget', async (weekOf: string, { getState }) => {
	const { auth: { accessToken } } = getState() as IState;
	return await hub.getBudget(accessToken, weekOf);
});

export const saveIncome = createAsyncThunk('budget/saveIncome', async (income: IIncome, { getState }) => {
	const { auth: { accessToken } } = getState() as IState;
	await hub.saveIncome(accessToken, income);
});

export const saveExpense = createAsyncThunk('budget/saveExpense', async (expense: IExpense, { getState }) => {
	const { auth: { accessToken } } = getState() as IState;
	await hub.saveExpense(accessToken, expense);
});

export const saveTransaction = createAsyncThunk(
	'budget/saveTransaction',
	async (transaction: ITransaction, { getState }) => {
		const { auth: { accessToken } } = getState() as IState;
		await hub.saveTransaction(accessToken, transaction);
	});

export const getWeeklyTransactions = createAsyncThunk(
	'budget/getWeeklyTransactions',
	async (weekOf: string, { getState }) => {
		const { auth: { accessToken } } = getState() as IState;
		return await hub.getWeeklyTransactions(accessToken, weekOf);
	});
