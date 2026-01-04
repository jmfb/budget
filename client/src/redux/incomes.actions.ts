import { bindActionCreators } from "@reduxjs/toolkit";
import { incomesHub } from "~/api";
import { ICreateIncomeRequest, IUpdateIncomeRequest } from "~/models";
import { IAsyncActionOptions } from "./IAsyncActionOptions";
import { incomesSlice } from "./incomes.slice";
import { promiseService } from "~/services";

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

export async function importPreviousYearIncomes(
	_: void,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(incomesSlice.actions, dispatch);
	const currentYear = new Date().getFullYear();
	const previousYear = currentYear - 1;
	const incomes = await incomesHub.getIncomes(accessToken, previousYear);
	const newIncomes = await promiseService.parallelMap(
		incomes,
		async (income) => {
			const { id, year, ...rest } = income;
			void id;
			void year;
			const newIncomeId = await incomesHub.createIncome(accessToken, {
				...rest,
				year: currentYear,
			});
			const newIncome = await incomesHub.getIncome(
				accessToken,
				newIncomeId,
			);
			if (newIncome === null) {
				throw new Error(
					`Income ${newIncomeId} was not found after import`,
				);
			}
			return newIncome;
		},
		{ maxDegreesOfParallelism: 10 },
	);
	for (const newIncome of newIncomes) {
		actions.createIncome(newIncome);
	}
}
