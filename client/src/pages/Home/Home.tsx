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
	isSavingPendingItem: boolean;
	savingPendingItemSuccess: boolean;
	weekOf: string;
	setWeekOf(value: string): void;
	setOnlyShowNewItems(value: boolean): void;
	savePendingItem(pendingItem: IPendingItem): void;
	deletePendingItem(pendingItem: IPendingItem): void;
	clearPendingItemSave(): void;
}

export function Home({
	onlyShowNewItems,
	incomes,
	expenses,
	pendingItems,
	weeklyTransactions,
	expenseTransactions,
	isSavingPendingItem,
	savingPendingItemSuccess,
	weekOf,
	setWeekOf,
	setOnlyShowNewItems,
	savePendingItem,
	deletePendingItem,
	clearPendingItemSave
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
							pendingItems,
							expenseTransactions,
							includePendingItems,
							isSavingPendingItem,
							savingPendingItemSuccess,
							setOnlyShowNewItems,
							savePendingItem,
							deletePendingItem,
							clearPendingItemSave
						}}
						variant='home'
						transactions={week.transactions}
					/>
				</div>
			)}
		</>
	);
}
