import { createAsyncThunk } from "@reduxjs/toolkit";
import { IState } from "./IState";
import { categoriesHub } from "~/api";

export const getCategories = createAsyncThunk(
	"categories/getCategories",
	async (_, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await categoriesHub.getCategories(accessToken);
	},
);
