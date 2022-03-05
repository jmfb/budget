import { get, put, del } from './hub';
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

export async function deleteIncome(accessToken: string, name: string) {
	await del({
		endpoint: `/api/budget/incomes/${encodeURIComponent(name)}`,
		accessToken
	});
}

export async function saveExpense(accessToken: string, expense: IExpense) {
	await put({
		endpoint: '/api/budget/expense',
		accessToken,
		body: expense
	});
}

export async function deleteExpense(accessToken: string, name: string) {
	await del({
		endpoint: `/api/budget/expenses/${encodeURIComponent(name)}`,
		accessToken
	});
}

export async function saveTransaction(accessToken: string, transaction: ITransaction) {
	await put({
		endpoint: '/api/budget/transactions',
		accessToken,
		body: transaction
	});
}

export async function deleteTransaction(accessToken: string, date: string, id: number) {
	await del({
		endpoint: `/api/budget/transactions/${date}/${id}`,
		accessToken
	});
}

export async function getWeeklyTransactions(accessToken: string, weekOf: string) {
	return await get<ITransaction[]>({
		endpoint: `/api/budget/transactions/week-of/${weekOf}`,
		accessToken
	});
}
