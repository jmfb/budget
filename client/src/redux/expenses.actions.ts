import { createAsyncThunk } from "@reduxjs/toolkit";
import { IState } from "./IState";
import { expensesHub } from "~/api";

export const getExpenses = createAsyncThunk(
	"expenses/getExpenses",
	async (year: number, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await expensesHub.getExpenses(accessToken, year);
	},
);
