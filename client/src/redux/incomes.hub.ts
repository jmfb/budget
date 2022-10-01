import { get, getOrDefault } from './hub';
import { IIncome, IGetIncomesResponse } from '~/models';

export async function getVersion(accessToken: string) {
	return await get<number>({
		endpoint: '/api/incomes/version',
		accessToken
	});
}

export async function getIncomes(accessToken: string) {
	return await get<IGetIncomesResponse>({
		endpoint: '/api/incomes',
		accessToken
	});
}

export async function getIncome(accessToken: string, name: string) {
	return await getOrDefault<IIncome>({
		endpoint: `/api/incomes/${encodeURIComponent(name)}`,
		accessToken
	});
}

export async function putIncome(accessToken: string, income: IIncome) {
	return await get<number>({
		endpoint: '/api/incomes',
		method: 'PUT',
		accessToken,
		body: income
	});
}

export async function deleteIncome(accessToken: string, name: string) {
	return await get<number>({
		endpoint: `/api/incomes/${encodeURIComponent(name)}`,
		method: 'DELETE',
		accessToken
	});
}
