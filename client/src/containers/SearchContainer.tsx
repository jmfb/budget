import { useState, useMemo } from "react";
import { Search } from "~/pages";
import { useAppSelector, getExpenseTransactions } from "~/redux";
import { budgetService } from "~/services";

export default function SearchContainer() {
	const allTransactions = useAppSelector(
		(state) => state.transactions.transactions,
	);
	const isLoading = useAppSelector((state) => state.transactions.isLoading);
	const categoryById = useAppSelector(
		(state) => state.categories.categoryById,
	);
	const incomes = useAppSelector((state) => state.incomes.incomes);
	const incomeById = useAppSelector((state) => state.incomes.incomeById);
	const expenses = useAppSelector((state) => state.expenses.expenses);
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
			incomes={incomes}
			expenses={expenses}
			expenseTransactions={expenseTransactions}
			transactions={matchingTransactions}
			onUpdateSearch={setSearchQuery}
		/>
	);
}
