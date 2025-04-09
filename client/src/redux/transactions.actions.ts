import { bindActionCreators } from "@reduxjs/toolkit";
import { transactionsHub } from "~/api";
import { ICreateTransactionRequest, IUpdateTransactionRequest } from "~/models";
import { IAsyncActionOptions } from "./IAsyncActionOptions";
import { transactionsSlice } from "./transactions.slice";

export async function createTransaction(
	request: ICreateTransactionRequest,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(transactionsSlice.actions, dispatch);
	const transactionId = await transactionsHub.createTransaction(
		accessToken,
		request,
	);
	const transaction = await transactionsHub.getTransaction(
		accessToken,
		transactionId,
	);
	if (transaction === null) {
		throw new Error(
			`Transaction ${transactionId} was not found after create`,
		);
	}
	actions.createTransaction(transaction);
}

export async function updateTransaction(
	parameters: { transactionId: number; request: IUpdateTransactionRequest },
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { transactionId, request } = parameters;
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(transactionsSlice.actions, dispatch);
	await transactionsHub.updateTransaction(
		accessToken,
		transactionId,
		request,
	);
	const transaction = await transactionsHub.getTransaction(
		accessToken,
		transactionId,
	);
	if (transaction === null) {
		throw new Error(
			`Transaction ${transactionId} was not found after update`,
		);
	}
	actions.updateTransaction(transaction);
}

export async function deleteTransaction(
	transactionId: number,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(transactionsSlice.actions, dispatch);
	await transactionsHub.deleteTransaction(accessToken, transactionId);
	actions.deleteTransaction(transactionId);
}
