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
			.filter((transaction) => transaction.expenseId !== null)
			.reduce(
				(map, transaction) => {
					if (map[transaction.expenseId!]) {
						map[transaction.expenseId!].push(transaction);
					} else {
						map[transaction.expenseId!] = [transaction];
					}
					return map;
				},
				{} as Record<number, ITransaction[]>,
			),
);
