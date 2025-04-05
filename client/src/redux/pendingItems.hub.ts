import { get, getOrDefault, download } from "./hub";
import { IPendingItem, IGetPendingItemsResponse } from "~/models";

export async function getVersion(accessToken: string) {
	return await get<number>({
		endpoint: "/api/pending-items/version",
		accessToken,
	});
}

export async function getPendingItems(accessToken: string) {
	return await get<IGetPendingItemsResponse>({
		endpoint: "/api/pending-items",
		accessToken,
	});
}

export async function getPendingItem(accessToken: string, id: number) {
	return await getOrDefault<IPendingItem>({
		endpoint: `/api/pending-items/${id}`,
		accessToken,
	});
}

export async function putPendingItem(
	accessToken: string,
	pendingItem: IPendingItem,
) {
	return await get<number>({
		endpoint: "/api/pending-items",
		method: "PUT",
		accessToken,
		body: pendingItem,
	});
}

export async function deletePendingItem(accessToken: string, id: number) {
	return await get<number>({
		endpoint: `/api/pending-items/${id}`,
		method: "DELETE",
		accessToken,
	});
}

export async function downloadPendingItems(accessToken: string) {
	await download({
		endpoint: "/api/pending-items/download",
		accessToken,
	});
}
