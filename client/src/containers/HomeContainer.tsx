import { useMemo, useState } from "react";
import { Home } from "~/pages";
import {
	useActions,
	useAppSelector,
	budgetSlice,
	getExpenseTransactions,
} from "~/redux";
import { dateService } from "~/services";

export default function HomeContainer() {
	const { setOnlyShowNewItems } = useActions(budgetSlice);
	const isLoading = useAppSelector((state) => state.transactions.isLoading);
	const onlyShowNewItems = useAppSelector(
		(state) => state.budget.onlyShowNewItems,
	);
	const categoryById = useAppSelector(
		(state) => state.categories.categoryById,
	);
	const incomeById = useAppSelector((state) => state.incomes.incomeById);
	const expenseById = useAppSelector((state) => state.expenses.expenseById);
	const pendingItems = useAppSelector(
		(state) => state.pendingItems.pendingItems,
	);
	const transactions = useAppSelector(
		(state) => state.transactions.transactions,
	);
	const expenseTransactions = useAppSelector(getExpenseTransactions);
	const [weekOf, setWeekOf] = useState(dateService.getStartOfCurrentWeek());

	const nextWeekOf = dateService.addDays(weekOf, 7);

	const week = useMemo(
		() =>
			transactions.filter(
				(transaction) =>
					transaction.date >= weekOf && transaction.date < nextWeekOf,
			),
		[transactions, weekOf],
	);

	return (
		<Home
			onlyShowNewItems={onlyShowNewItems}
			categoryById={categoryById}
			incomeById={incomeById}
			expenseById={expenseById}
			pendingItems={pendingItems}
			isLoading={isLoading}
			week={week}
			expenseTransactions={expenseTransactions}
			weekOf={weekOf}
			setWeekOf={setWeekOf}
			setOnlyShowNewItems={setOnlyShowNewItems}
		/>
	);
}
