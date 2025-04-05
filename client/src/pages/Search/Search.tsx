import { Input, PageLoading } from '~/components';
import { Transactions } from '~/pages/Home/Transactions';
import { IExpense, IIncome, ITransaction } from '~/models';
import styles from './Search.module.css';

export interface ISearchProps {
	searchQuery: string;
	isLoading: boolean;
	incomes: IIncome[];
	expenses: IExpense[];
	expenseTransactions: Record<string, ITransaction[]>;
	transactions: ITransaction[];
	onUpdateSearch(searchQuery: string): void;
}

export function Search({
	searchQuery,
	isLoading,
	incomes,
	expenses,
	expenseTransactions,
	transactions,
	onUpdateSearch
}: ISearchProps) {
	if (isLoading) {
		return <PageLoading />;
	}

	return (
		<div className={styles.root}>
			<Input
				name=''
				autoFocus
				placeholder='Search for transactions...'
				value={searchQuery}
				onChange={onUpdateSearch}
			/>
			{!!searchQuery && transactions.length === 0 && (
				<div className={styles['no-results']}>
					No transactions matched your search.
				</div>
			)}
			<Transactions
				transactions={transactions}
				incomes={incomes}
				expenses={expenses}
				expenseTransactions={expenseTransactions}
				variant='search'
				onlyShowNewItems={false}
				setOnlyShowNewItems={undefined}
				includePendingItems={false}
			/>
		</div>
	);
}
