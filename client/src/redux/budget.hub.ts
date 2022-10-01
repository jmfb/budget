import { get, send } from './hub';
import {
	ITransaction,
	IBudgetResponse,
	IWeeklyTransactionsResponse
} from '~/models';

export async function getBudget(accessToken: string, weekOf: string) {
	return await get<IBudgetResponse>({
		endpoint: `/api/budget/week-of/${weekOf}`,
		accessToken
	});
}

export async function saveTransaction(
	accessToken: string,
	transaction: ITransaction
) {
	await send({
		endpoint: '/api/budget/transactions',
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
	await send({
		endpoint: `/api/budget/transactions/${date}/${id}`,
		method: 'DELETE',
		accessToken
	});
}

export async function getWeeklyTransactions(
	accessToken: string,
	weekOf: string
) {
	return await get<IWeeklyTransactionsResponse>({
		endpoint: `/api/budget/transactions/week-of/${weekOf}`,
		accessToken
	});
}

export async function getYearlyExpenses(
	accessToken: string,
	expense: string,
	year: number
) {
	return await get<ITransaction[]>({
		endpoint: `/api/budget/yearly-expenses/${encodeURIComponent(
			expense
		)}/${year}`,
		accessToken
	});
}
