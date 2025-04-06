import { createAsyncThunk } from "@reduxjs/toolkit";
import { IState } from "./IState";
import { transactionsHub } from "~/api";
import { ITransaction } from "~/models";
import { dateService } from "~/services";

async function getAllTransactions(
	accessToken: string,
	startDateInclusive: string,
	endDateExclusive: string,
) {
	const pageSize = 1000;
	let pageKey: string | null = null;
	const allTransactions: ITransaction[] = [];
	do {
		const page = await transactionsHub.getTransactions(
			accessToken,
			startDateInclusive,
			endDateExclusive,
			pageSize,
			pageKey,
		);
		allTransactions.push(...page.transactions);
		pageKey = page.nextPageKey;
	} while (pageKey);
	return allTransactions;
}

export const getPreviousYear = createAsyncThunk(
	"transactions/getPreviousYear",
	async (year: number, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		return await getAllTransactions(
			accessToken,
			`${year}-01-01`,
			`${year + 1}-01-01`,
		);
	},
);

export const getRestOfCurrentYear = createAsyncThunk(
	"transactions/getRestOfCurrentYear",
	async (_, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		const currentYear = dateService.getCurrentYear();
		const startOfCurrentWeek = dateService.getStartOfCurrentWeek();
		const yearAtBeginngingOfWeek = dateService.getYear(startOfCurrentWeek);
		if (yearAtBeginngingOfWeek < currentYear) {
			return [];
		}
		return await getAllTransactions(
			accessToken,
			`${currentYear}-01-01`,
			startOfCurrentWeek,
		);
	},
);

export const getCurrentWeek = createAsyncThunk(
	"transactions/getCurrentWeek",
	async (_, { getState }) => {
		const {
			auth: { accessToken },
		} = getState() as IState;
		const startOfCurrentWeek = dateService.getStartOfCurrentWeek();
		return await getAllTransactions(
			accessToken,
			startOfCurrentWeek,
			dateService.addDays(startOfCurrentWeek, 7),
		);
	},
);
