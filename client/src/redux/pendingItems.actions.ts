import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPendingItem } from "~/models";
import { IState } from "./IState";
import * as hub from "./pendingItems.hub";

export const refreshPendingItems = createAsyncThunk(
	"pendingItems/refreshPendingItems",
	async (version: number, { getState }) => {
		const {
			auth: { accessToken },
			pendingItems: { version: storeVersion },
		} = getState() as IState;
		const newVersion = version ?? (await hub.getVersion(accessToken));
		return newVersion === storeVersion
			? null
			: await hub.getPendingItems(accessToken);
	},
);

export const savePendingItem = createAsyncThunk(
	"pendingItems/savePendingItem",
	async (pendingItem: IPendingItem, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.putPendingItem(accessToken, pendingItem);
	},
);

export const deletePendingItem = createAsyncThunk(
	"pendingItems/deletePendingItem",
	async ({ id }: IPendingItem, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.deletePendingItem(accessToken, id);
	},
);

export const downloadPendingItems = createAsyncThunk(
	"pendingItems/downloadPendingItems",
	async (request, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.downloadPendingItems(accessToken);
	},
);
