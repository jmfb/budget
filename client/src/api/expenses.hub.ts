import { get, getOrDefault, send } from "./hub";
import {
	IExpense,
	ICreateExpenseRequest,
	IUpdateExpenseRequest,
} from "~/models";

const baseUrl = import.meta.env.VITE_API_URL;

export async function getExpenses(accessToken: string, year: number) {
	return await get<IExpense[]>({
		baseUrl,
		accessToken,
		endpoint: "/api/expenses",
		query: { year: year.toString() },
	});
}

export async function getExpense(accessToken: string, id: number) {
	return await getOrDefault<IExpense>({
		baseUrl,
		accessToken,
		endpoint: `/api/expenses/${id}`,
	});
}

export async function createExpense(
	accessToken: string,
	request: ICreateExpenseRequest,
) {
	return await get<number>({
		baseUrl,
		accessToken,
		endpoint: "/api/expenses",
		method: "POST",
		body: request,
	});
}

export async function updateExpense(
	accessToken: string,
	id: number,
	request: IUpdateExpenseRequest,
) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/expenses/${id}`,
		method: "PUT",
		body: request,
	});
}

export async function deleteExpense(accessToken: string, id: number) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/expenses/${id}`,
		method: "DELETE",
	});
}
