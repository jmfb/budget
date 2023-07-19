import React from 'react';
import { PageLoading } from '~/components';
import { WeekView } from './WeekView';
import { BudgetView } from './BudgetView';
import { Transactions } from './Transactions';
import { IIncome, IExpense, ITransaction, IPendingItem } from '~/models';
import { IWeekState } from '~/redux';
import { dateService } from '~/services';
import cx from 'classnames';
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
			<div className={cx('responsive', styles.fixedTop)}>
				<WeekView
					{...{
						weekOf,
						weeklyTransactions,
						setWeekOf
					}}
				/>
				{isLoadingWeek ? (
					<PageLoading message='Loading transactions...' />
				) : (
					<BudgetView
						{...{
							incomes,
							expenses,
							expenseTransactions
						}}
						pendingItems={includePendingItems ? pendingItems : []}
						transactions={week.transactions}
					/>
				)}
			</div>
			{!isLoadingWeek && (
				<div className={styles.scrollingBottom}>
					<Transactions
						{...{
							onlyShowNewItems,
							incomes,
							expenses,
							expenseTransactions,
							includePendingItems,
							setOnlyShowNewItems
						}}
						variant='home'
						transactions={week.transactions}
					/>
				</div>
			)}
		</>
	);
}
