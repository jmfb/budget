import { createAsyncThunk } from "@reduxjs/toolkit";
import { IIncome } from "~/models";
import { IState } from "./IState";
import * as hub from "./incomes.hub";

export const refreshIncomes = createAsyncThunk(
	"incomes/refreshIncomes",
	async (_, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.getIncomes(accessToken);
	},
);

export const saveIncome = createAsyncThunk(
	"incomes/saveIncome",
	async (income: IIncome, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.putIncome(accessToken, income);
	},
);

export const deleteIncome = createAsyncThunk(
	"incomes/deleteIncome",
	async ({ name }: IIncome, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.deleteIncome(accessToken, name);
	},
);

export const downloadIncomes = createAsyncThunk(
	"incomes/downloadIncomes",
	async (_, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.downloadIncomes(accessToken);
	},
);
