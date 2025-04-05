import { AnyAction, createAsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { ITransaction } from "~/models";
import { IState } from "./IState";
import * as hub from "./transactions.hub";

export const getTransactions = createAsyncThunk(
	"transactions/getTransactions",
	async (weekOf: string, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.getTransactions(accessToken, weekOf);
	},
);

interface ILoadWeekResult {
	weekOf: string;
	wasSuccessful: boolean;
}

async function loadWeek(
	weekOf: string,
	dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
) {
	try {
		await dispatch(getTransactions(weekOf));
		return { weekOf, wasSuccessful: true };
	} catch (error) {
		return { weekOf, wasSuccessful: false };
	}
}

export const refreshTransactions = createAsyncThunk(
	"transactions/refreshTransactions",
	async (weekVersions: Record<string, number>, { getState, dispatch }) => {
		const {
			transactions: { weeks },
		} = getState() as IState;
		const weeksToGet = Object.entries(weekVersions)
			.filter(([weekOf, version]) => weeks[weekOf]?.version !== version)
			.map(([weekOf]) => weekOf)
			.reverse();

		const maxConcurrent = 10;
		const initialWeeks = weeksToGet.slice(0, maxConcurrent);
		const pendingWeeks = weeksToGet.slice(maxConcurrent);
		const currentRequests = new Map<string, Promise<ILoadWeekResult>>(
			initialWeeks.map((weekOf) => [weekOf, loadWeek(weekOf, dispatch)]),
		);
		for (const weekOf of pendingWeeks) {
			const result = await Promise.any(currentRequests.values());
			currentRequests.delete(result.weekOf);
			if (!result.wasSuccessful) {
				break;
			}
			currentRequests.set(weekOf, loadWeek(weekOf, dispatch));
		}
		await Promise.all(currentRequests.values());
	},
);

export const saveTransaction = createAsyncThunk(
	"transactions/saveTransaction",
	async (transaction: ITransaction, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.putTransaction(accessToken, transaction);
	},
);

export const deleteTransaction = createAsyncThunk(
	"transactions/deleteTransaction",
	async ({ date, id }: ITransaction, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.deleteTransaction(accessToken, date, id);
	},
);

export const downloadTransactions = createAsyncThunk(
	"transactions/downloadTransactions",
	async (request, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await hub.downloadTransactions(accessToken);
	},
);
