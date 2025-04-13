import { useState, useMemo } from "react";
import { Search } from "./Search";
import { useAppSelector, getExpenseTransactions } from "~/redux";
import { budgetService } from "~/services";

export function SearchContainer() {
	const allTransactions = useAppSelector(
		(state) => state.transactions.transactions,
	);
	const isLoading = useAppSelector((state) => state.transactions.isLoading);
	const categoryById = useAppSelector(
		(state) => state.categories.categoryById,
	);
	const incomeById = useAppSelector((state) => state.incomes.incomeById);
	const expenseById = useAppSelector((state) => state.expenses.expenseById);
	const expenseTransactions = useAppSelector(getExpenseTransactions);

	const [searchQuery, setSearchQuery] = useState("");

	const matchingTransactions = useMemo(
		() =>
			!searchQuery
				? []
				: allTransactions.filter((transaction) =>
						budgetService.matchesTransaction(
							searchQuery,
							transaction,
							categoryById,
							incomeById,
							expenseById,
						),
					),
		[searchQuery, allTransactions, categoryById, incomeById, expenseById],
	);

	return (
		<Search
			searchQuery={searchQuery}
			isLoading={isLoading}
			categoryById={categoryById}
			incomeById={incomeById}
			expenseById={expenseById}
			expenseTransactions={expenseTransactions}
			transactions={matchingTransactions}
			onUpdateSearch={setSearchQuery}
		/>
	);
}
