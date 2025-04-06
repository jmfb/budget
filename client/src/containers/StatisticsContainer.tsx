import { Statistics } from "~/pages";
import { dateService } from "~/services";
import { useAppSelector, getExpenseTransactions } from "~/redux";
import { useMemo } from "react";
import { ITransaction } from "~/models";

export default function StatisticsContainer() {
	const isLoading = useAppSelector((state) => state.transactions.isLoading);
	const expenseTransactions = useAppSelector(getExpenseTransactions);
	const transactions = useAppSelector(
		(state) => state.transactions.transactions,
	);
	const incomes = useAppSelector((state) => state.incomes.incomes);
	const expenses = useAppSelector((state) => state.expenses.expenses);
	const pendingItems = useAppSelector(
		(state) => state.pendingItems.pendingItems,
	);
	const weeksOf = useMemo(() => dateService.getStartOfLastXWeeks(12), []);
	const transactionsByWeek = useMemo(
		() =>
			transactions.reduce(
				(map, transaction) => {
					const startOfWeek = dateService.getStartOfWeek(
						transaction.date,
					);
					if (map[startOfWeek]) {
						map[startOfWeek].push(transaction);
					} else {
						map[startOfWeek] = [transaction];
					}
					return map;
				},
				{} as Record<string, ITransaction[]>,
			),
		[transactions],
	);
	const weeks = useMemo(
		() => weeksOf.map((weekOf) => transactionsByWeek[weekOf] ?? []),
		[transactionsByWeek, weeksOf],
	);
	const allWeeksInYear = useMemo(
		() =>
			dateService
				.getAllWeeksOfCurrentYear()
				.map((weekOf) => transactionsByWeek[weekOf] ?? []),
		[transactionsByWeek],
	);

	return (
		<Statistics
			incomes={incomes}
			expenses={expenses}
			pendingItems={pendingItems}
			isLoading={isLoading}
			weeks={weeks}
			allWeeksInYear={allWeeksInYear}
			expenseTransactions={expenseTransactions}
		/>
	);
}
