import { get, getOrDefault, download } from "./hub";
import { IIncome, IGetIncomesResponse } from "~/models";

const baseUrl = import.meta.env.VITE_API_URL;

export async function getVersion(accessToken: string) {
	return await get<number>({
		baseUrl,
		endpoint: "/api/incomes/version",
		accessToken,
	});
}

export async function getIncomes(accessToken: string) {
	return await get<IGetIncomesResponse>({
		baseUrl,
		endpoint: "/api/incomes",
		accessToken,
	});
}

export async function getIncome(accessToken: string, name: string) {
	return await getOrDefault<IIncome>({
		baseUrl,
		endpoint: `/api/incomes/${encodeURIComponent(name)}`,
		accessToken,
	});
}

export async function putIncome(accessToken: string, income: IIncome) {
	return await get<number>({
		baseUrl,
		endpoint: "/api/incomes",
		method: "PUT",
		accessToken,
		body: income,
	});
}

export async function deleteIncome(accessToken: string, name: string) {
	return await get<number>({
		baseUrl,
		endpoint: `/api/incomes/${encodeURIComponent(name)}`,
		method: "DELETE",
		accessToken,
	});
}

export async function downloadIncomes(accessToken: string) {
	await download({
		baseUrl,
		endpoint: "/api/incomes/download",
		accessToken,
	});
}
