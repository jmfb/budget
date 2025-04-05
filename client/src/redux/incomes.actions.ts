import { createAsyncThunk } from "@reduxjs/toolkit";
import { IState } from "./IState";
import { incomesHub } from "~/api";

export const getIncomes = createAsyncThunk(
	"incomes/getIncomes",
	async (year: number, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await incomesHub.getIncomes(accessToken, year);
	},
);
