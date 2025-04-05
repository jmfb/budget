import { createSelector } from "@reduxjs/toolkit";
import { ITransaction } from "~/models";
import { IState } from "./IState";

const getWeeks = (state: IState) => state.transactions.weeks;

const getAllTransactions = createSelector(getWeeks, (weeks) =>
	Object.entries(weeks).flatMap(([, week]) => week.transactions),
);

const getCurrentYearTransactions = createSelector(
	getAllTransactions,
	(transactions) =>
		transactions.filter(
			(transaction) =>
				transaction.date >= `${new Date().getFullYear()}-01-01`,
		),
);

export const getExpenseTransactions = createSelector(
	getCurrentYearTransactions,
	(transactions) =>
		transactions
			.filter((transaction) => !!transaction.expenseName)
			.reduce(
				(map, transaction) => {
					if (map[transaction.expenseName]) {
						map[transaction.expenseName].push(transaction);
					} else {
						map[transaction.expenseName] = [transaction];
					}
					return map;
				},
				{} as Record<string, ITransaction[]>,
			),
);
