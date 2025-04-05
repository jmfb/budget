import { get, getOrDefault, send } from "./hub";
import {
	IPendingItem,
	ICreatePendingItemRequest,
	IUpdatePendingItemRequest,
} from "~/models";

const baseUrl = import.meta.env.VITE_API_URL;

export async function getPendingItems(accessToken: string) {
	return await get<IPendingItem[]>({
		baseUrl,
		accessToken,
		endpoint: "/api/pending-items",
	});
}

export async function getPendingItem(accessToken: string, id: number) {
	return await getOrDefault<IPendingItem>({
		baseUrl,
		accessToken,
		endpoint: `/api/pending-items/${id}`,
	});
}

export async function createPendingItem(
	accessToken: string,
	request: ICreatePendingItemRequest,
) {
	return await get<number>({
		baseUrl,
		accessToken,
		endpoint: "/api/pending-items",
		method: "POST",
		body: request,
	});
}

export async function updatePendingItem(
	accessToken: string,
	id: number,
	request: IUpdatePendingItemRequest,
) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/pending-items/${id}`,
		method: "PUT",
		body: request,
	});
}

export async function deletePendingItem(accessToken: string, id: number) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/pending-items/${id}`,
		method: "DELETE",
	});
}
