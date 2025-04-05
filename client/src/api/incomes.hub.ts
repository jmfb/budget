import { get, getOrDefault, send } from "./hub";
import { IIncome, ICreateIncomeRequest, IUpdateIncomeRequest } from "~/models";

const baseUrl = import.meta.env.VITE_API_URL;

export async function getIncomes(accessToken: string, year: number) {
	return await get<IIncome[]>({
		baseUrl,
		accessToken,
		endpoint: "/api/incomes",
		query: { year: year.toString() },
	});
}

export async function getIncome(accessToken: string, id: number) {
	return await getOrDefault<IIncome>({
		baseUrl,
		accessToken,
		endpoint: `/api/incomes/${id}`,
	});
}

export async function createIncome(
	accessToken: string,
	request: ICreateIncomeRequest,
) {
	return await get<number>({
		baseUrl,
		accessToken,
		endpoint: `/api/incomes`,
		method: "POST",
		body: request,
	});
}

export async function updateIncome(
	accessToken: string,
	id: number,
	request: IUpdateIncomeRequest,
) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/incomes/${id}`,
		method: "PUT",
		body: request,
	});
}

export async function deleteIncome(accessToken: string, id: number) {
	return await get<number>({
		baseUrl,
		accessToken,
		endpoint: `/api/incomes/${id}`,
		method: "DELETE",
	});
}
