import { createAsyncThunk } from "@reduxjs/toolkit";
import { IState } from "./IState";
import { pendingItemsHub } from "~/api";

export const getPendingItems = createAsyncThunk(
	"pendingItems/getPendingItems",
	async (_, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await pendingItemsHub.getPendingItems(accessToken);
	},
);
