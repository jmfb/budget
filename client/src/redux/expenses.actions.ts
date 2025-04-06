import { bindActionCreators } from "@reduxjs/toolkit";
import { expensesHub } from "~/api";
import { ICreateExpenseRequest, IUpdateExpenseRequest } from "~/models";
import { IAsyncActionOptions } from "./IAsyncActionOptions";
import { expensesSlice } from "./expenses.slice";

export async function createExpense(
	request: ICreateExpenseRequest,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(expensesSlice.actions, dispatch);
	const expenseId = await expensesHub.createExpense(accessToken, request);
	const expense = await expensesHub.getExpense(accessToken, expenseId);
	if (expense === null) {
		throw new Error(`Expense ${expenseId} was not found after create`);
	}
	actions.createExpense(expense);
}

export async function updateExpense(
	parameters: { expenseId: number; request: IUpdateExpenseRequest },
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { expenseId, request } = parameters;
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(expensesSlice.actions, dispatch);
	await expensesHub.updateExpense(accessToken, expenseId, request);
	const expense = await expensesHub.getExpense(accessToken, expenseId);
	if (expense === null) {
		throw new Error(`Expense ${expenseId} was not found after update`);
	}
	actions.updateExpense(expense);
}

export async function deleteExpense(
	expenseId: number,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(expensesSlice.actions, dispatch);
	await expensesHub.deleteExpense(accessToken, expenseId);
	actions.deleteExpense(expenseId);
}
