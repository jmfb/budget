import { get, getOrDefault, download } from './hub';
import { IExpense, IGetExpensesResponse } from '~/models';

export async function getVersion(accessToken: string) {
	return await get<number>({
		endpoint: '/api/expenses/version',
		accessToken
	});
}

export async function getExpenses(accessToken: string) {
	return await get<IGetExpensesResponse>({
		endpoint: '/api/expenses',
		accessToken
	});
}

export async function getExpense(accessToken: string, name: string) {
	return await getOrDefault<IExpense>({
		endpoint: `/api/expenses/${encodeURIComponent(name)}`,
		accessToken
	});
}

export async function putExpense(accessToken: string, expense: IExpense) {
	return await get<number>({
		endpoint: '/api/expenses',
		method: 'PUT',
		accessToken,
		body: expense
	});
}

export async function deleteExpense(accessToken: string, name: string) {
	return await get<number>({
		endpoint: `/api/expenses/${encodeURIComponent(name)}`,
		method: 'DELETE',
		accessToken
	});
}

export async function downloadExpenses(accessToken: string) {
	await download({
		endpoint: '/api/expenses/download',
		accessToken
	});
}
