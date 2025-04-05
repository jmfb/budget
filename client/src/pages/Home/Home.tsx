import { PageLoading } from '~/components';
import { WeekView } from './WeekView';
import { BudgetView } from './BudgetView';
import { Transactions } from './Transactions';
import { IIncome, IExpense, ITransaction, IPendingItem } from '~/models';
import { IWeekState } from '~/redux';
import { dateService } from '~/services';
import { clsx } from 'clsx';
import styles from './Home.module.css';

export interface IHomeProps {
	onlyShowNewItems: boolean;
	incomes: IIncome[];
	expenses: IExpense[];
	pendingItems: IPendingItem[];
	weeklyTransactions: Record<string, IWeekState>;
	expenseTransactions: Record<string, ITransaction[]>;
	weekOf: string;
	setWeekOf(value: string): void;
	setOnlyShowNewItems(value: boolean): void;
}

export function Home({
	onlyShowNewItems,
	incomes,
	expenses,
	pendingItems,
	weeklyTransactions,
	expenseTransactions,
	weekOf,
	setWeekOf,
	setOnlyShowNewItems
}: IHomeProps) {
	const week = weeklyTransactions[weekOf];
	const isLoadingWeek = week === undefined || week.isLoading;
	const includePendingItems = weekOf > dateService.getStartOfLastWeek();

	return (
		<>
			<div className={clsx('responsive', styles.fixedTop)}>
				<WeekView
					weekOf={weekOf}
					weeklyTransactions={weeklyTransactions}
					setWeekOf={setWeekOf}
				/>
				{isLoadingWeek ? (
					<PageLoading message='Loading transactions...' />
				) : (
					<BudgetView
						incomes={incomes}
						expenses={expenses}
						expenseTransactions={expenseTransactions}
						pendingItems={includePendingItems ? pendingItems : []}
						transactions={week.transactions}
					/>
				)}
			</div>
			{!isLoadingWeek && (
				<div className={styles.scrollingBottom}>
					<Transactions
						onlyShowNewItems={onlyShowNewItems}
						incomes={incomes}
						expenses={expenses}
						expenseTransactions={expenseTransactions}
						includePendingItems={includePendingItems}
						setOnlyShowNewItems={setOnlyShowNewItems}
						variant='home'
						transactions={week.transactions}
					/>
				</div>
			)}
		</>
	);
}
