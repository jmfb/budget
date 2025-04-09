import { bindActionCreators } from "@reduxjs/toolkit";
import { pendingItemsHub } from "~/api";
import { ICreatePendingItemRequest, IUpdatePendingItemRequest } from "~/models";
import { pendingItemsSlice } from "./pendingItems.slice";
import { IAsyncActionOptions } from "./IAsyncActionOptions";

export async function createPendingItem(
	request: ICreatePendingItemRequest,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(pendingItemsSlice.actions, dispatch);
	const pendingItemId = await pendingItemsHub.createPendingItem(
		accessToken,
		request,
	);
	const pendingItem = await pendingItemsHub.getPendingItem(
		accessToken,
		pendingItemId,
	);
	if (pendingItem === null) {
		throw new Error(
			`Pending item ${pendingItemId} was not found after create`,
		);
	}
	actions.createPendingItem(pendingItem);
}

export async function updatePendingItem(
	parameters: { pendingItemId: number; request: IUpdatePendingItemRequest },
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { pendingItemId, request } = parameters;
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(pendingItemsSlice.actions, dispatch);
	await pendingItemsHub.updatePendingItem(
		accessToken,
		pendingItemId,
		request,
	);
	const pendingItem = await pendingItemsHub.getPendingItem(
		accessToken,
		pendingItemId,
	);
	if (pendingItem === null) {
		throw new Error(
			`Pending item ${pendingItemId} was not found after update`,
		);
	}
	actions.updatePendingItem(pendingItem);
}

export async function deletePendingItem(
	pendingItemId: number,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(pendingItemsSlice.actions, dispatch);
	await pendingItemsHub.deletePendingItem(accessToken, pendingItemId);
	actions.deletePendingItem(pendingItemId);
}
