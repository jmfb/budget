import { get, getOrDefault, send } from "./hub";
import {
	ITransaction,
	IGetTransactionsResponse,
	ICreateTransactionRequest,
	IUpdateTransactionRequest,
} from "~/models";

const baseUrl = import.meta.env.VITE_API_URL;

export async function getTransactions(
	accessToken: string,
	startDateInclusive: string,
	endDateExclusive: string,
	pageSize: number | null,
	pageKey: string | null,
) {
	const query: Record<string, string> = {
		startDateInclusive,
		endDateExclusive,
	};
	if (pageSize !== null) {
		query["pageSize"] = pageSize.toString();
	}
	if (pageKey !== null) {
		query["pageKey"] = pageKey;
	}
	return await get<IGetTransactionsResponse>({
		baseUrl,
		accessToken,
		endpoint: "/api/transactions",
		query,
	});
}

export async function getTransaction(accessToken: string, id: number) {
	return await getOrDefault<ITransaction>({
		baseUrl,
		accessToken,
		endpoint: `/api/transactions/${id}`,
	});
}

export async function createTransaction(
	accessToken: string,
	request: ICreateTransactionRequest,
) {
	return await get<number>({
		baseUrl,
		accessToken,
		endpoint: "/api/transactions",
		method: "POST",
		body: request,
	});
}

export async function updateTransaction(
	accessToken: string,
	id: number,
	request: IUpdateTransactionRequest,
) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/transactions/${id}`,
		method: "PUT",
		body: request,
	});
}

export async function deleteTransaction(accessToken: string, id: number) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/transactions/${id}`,
		method: "DELETE",
	});
}
