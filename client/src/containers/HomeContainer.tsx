import { useState } from 'react';
import { Home } from '~/pages';
import {
	useActions,
	useAppSelector,
	budgetSlice,
	getExpenseTransactions
} from '~/redux';
import { dateService } from '~/services';

export default function HomeContainer() {
	const { setOnlyShowNewItems } = useActions(budgetSlice);
	const onlyShowNewItems = useAppSelector(
		state => state.budget.onlyShowNewItems
	);
	const incomes = useAppSelector(state => state.incomes.incomes);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const pendingItems = useAppSelector(
		state => state.pendingItems.pendingItems
	);
	const weeklyTransactions = useAppSelector(
		state => state.transactions.weeks
	);
	const expenseTransactions = useAppSelector(getExpenseTransactions);
	const [weekOf, setWeekOf] = useState(dateService.getStartOfCurrentWeek());

	return (
		<Home
			onlyShowNewItems={onlyShowNewItems}
			incomes={incomes}
			expenses={expenses}
			pendingItems={pendingItems}
			weeklyTransactions={weeklyTransactions}
			expenseTransactions={expenseTransactions}
			weekOf={weekOf}
			setWeekOf={setWeekOf}
			setOnlyShowNewItems={setOnlyShowNewItems}
		/>
	);
}
