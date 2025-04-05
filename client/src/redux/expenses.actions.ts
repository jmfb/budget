import { createAsyncThunk } from "@reduxjs/toolkit";
import { IExpense } from "~/models";
import { IState } from "./IState";
import * as hub from "./expenses.hub";

export const refreshExpenses = createAsyncThunk(
	"expenses/refreshExpenses",
	async (version: number, { getState }) => {
		const {
			auth: { accessToken },
			expenses: { version: storeVersion },
		} = getState() as IState;
		const newVersion = version ?? (await hub.getVersion(accessToken));
		return newVersion === storeVersion
			? null
			: await hub.getExpenses(accessToken);
	},
);

export const saveExpense = createAsyncThunk(
	"expenses/saveExpense",
	async (expense: IExpense, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.putExpense(accessToken, expense);
	},
);

export const deleteExpense = createAsyncThunk(
	"expenses/deleteExpense",
	async ({ name }: IExpense, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.deleteExpense(accessToken, name);
	},
);

export const downloadExpenses = createAsyncThunk(
	"expenses/downloadExpenses",
	async (request, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.downloadExpenses(accessToken);
	},
);
