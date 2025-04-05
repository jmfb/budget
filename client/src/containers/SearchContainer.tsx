import { useState } from 'react';
import { Search } from '~/pages';
import { useAppSelector, getExpenseTransactions } from '~/redux';
import { budgetService } from '~/services';

export default function SearchContainer() {
	const weeks = useAppSelector(state => state.transactions.weeks);
	const incomes = useAppSelector(state => state.incomes.incomes);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const expenseTransactions = useAppSelector(getExpenseTransactions);

	const [searchQuery, setSearchQuery] = useState('');

	const weekStates = Object.values(weeks);
	const isLoading = weekStates.some(value => value.isLoading);

	const transactions = !searchQuery
		? []
		: weekStates.flatMap(state =>
				state.transactions.filter(transaction =>
					budgetService.matchesTransaction(searchQuery, transaction)
				)
		  );

	return (
		<Search
			searchQuery={searchQuery}
			isLoading={isLoading}
			incomes={incomes}
			expenses={expenses}
			expenseTransactions={expenseTransactions}
			transactions={transactions}
			onUpdateSearch={setSearchQuery}
		/>
	);
}
