import { get, download } from "./hub";
import { ITransaction, IGetTransactionsResponse } from "~/models";

const baseUrl = import.meta.env.VITE_API_URL;

export async function getVersion(accessToken: string, weekOf: string) {
	return await get<number>({
		baseUrl,
		endpoint: `/api/transactions/week-of/${weekOf}/version`,
		accessToken,
	});
}

export async function getTransactions(accessToken: string, weekOf: string) {
	return await get<IGetTransactionsResponse>({
		baseUrl,
		endpoint: `/api/transactions/week-of/${weekOf}`,
		accessToken,
	});
}

export async function putTransaction(
	accessToken: string,
	transaction: ITransaction,
) {
	return await get<number>({
		baseUrl,
		endpoint: "/api/transactions",
		method: "PUT",
		accessToken,
		body: transaction,
	});
}

export async function deleteTransaction(
	accessToken: string,
	date: string,
	id: number,
) {
	return await get<number>({
		baseUrl,
		endpoint: `/api/transactions/${date}/${id}`,
		method: "DELETE",
		accessToken,
	});
}

export async function downloadTransactions(accessToken: string) {
	await download({
		baseUrl,
		endpoint: "/api/transactions/download",
		accessToken,
	});
}
