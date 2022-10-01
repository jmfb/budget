import { get } from './hub';
import { ITransaction, IGetTransactionsResponse } from '~/models';

export async function getVersion(accessToken: string, weekOf: string) {
	return await get<number>({
		endpoint: `/api/transactions/week-of/${weekOf}/version`,
		accessToken
	});
}

export async function getTransactions(accessToken: string, weekOf: string) {
	return await get<IGetTransactionsResponse>({
		endpoint: `/api/transactions/week-of/${weekOf}`,
		accessToken
	});
}

export async function putTransaction(
	accessToken: string,
	transaction: ITransaction
) {
	return await get<number>({
		endpoint: '/api/transactions',
		method: 'PUT',
		accessToken,
		body: transaction
	});
}

export async function deleteTransaction(
	accessToken: string,
	date: string,
	id: number
) {
	return await get<number>({
		endpoint: `/api/transactions/${date}/${id}`,
		method: 'DELETE',
		accessToken
	});
}
