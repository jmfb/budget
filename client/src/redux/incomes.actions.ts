import { bindActionCreators, createAsyncThunk } from "@reduxjs/toolkit";
import { IState } from "./IState";
import { incomesHub } from "~/api";
import { ICreateIncomeRequest, IUpdateIncomeRequest } from "~/models";
import { IAsyncActionOptions } from "./IAsyncActionOptions";
import { incomesSlice } from "./incomes.slice";

export const getIncomes = createAsyncThunk(
	"incomes/getIncomes",
	async (year: number, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await incomesHub.getIncomes(accessToken, year);
	},
);

export async function createIncome(
	request: ICreateIncomeRequest,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(incomesSlice.actions, dispatch);
	const incomeId = await incomesHub.createIncome(accessToken, request);
	const income = await incomesHub.getIncome(accessToken, incomeId);
	if (income === null) {
		throw new Error(`Income ${incomeId} was not found after create`);
	}
	actions.createIncome(income);
}

export async function updateIncome(
	parameters: { incomeId: number; request: IUpdateIncomeRequest },
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { incomeId, request } = parameters;
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(incomesSlice.actions, dispatch);
	await incomesHub.updateIncome(accessToken, incomeId, request);
	const income = await incomesHub.getIncome(accessToken, incomeId);
	if (income === null) {
		throw new Error(`Income ${incomeId} was not found after update`);
	}
	actions.updateIncome(income);
}

export async function deleteIncome(
	incomeId: number,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(incomesSlice.actions, dispatch);
	await incomesHub.deleteIncome(accessToken, incomeId);
	actions.deleteIncome(incomeId);
}
