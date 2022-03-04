import { get, put } from './hub';
import { IIncome, IExpense, ITransaction, IBudgetResponse } from '~/models';

export async function getBudget(accessToken: string, weekOf: string) {
	return await get<IBudgetResponse>({
		endpoint: `/api/budget/week-of/${weekOf}`,
		accessToken
	});
}

export async function saveIncome(accessToken: string, income: IIncome) {
	await put({
		endpoint: '/api/budget/incomes',
		accessToken,
		body: income
	});
}

export async function saveExpense(accessToken: string, expense: IExpense) {
	await put({
		endpoint: '/api/budget/expense',
		accessToken,
		body: expense
	});
}

export async function saveTransaction(accessToken: string, transaction: ITransaction) {
	await put({
		endpoint: '/api/budget/transactions',
		accessToken,
		body: transaction
	});
}

export async function getWeeklyTransactions(accessToken: string, weekOf: string) {
	return await get<ITransaction[]>({
		endpoint: `/api/budget/transactions/week-of/${weekOf}`,
		accessToken
	});
}
