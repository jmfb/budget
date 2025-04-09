import React from 'react';
import { PageLoading } from '~/components';
import { Week } from './Week';
import { ExpenseBudget } from './ExpenseBudget';
import { IIncome, IExpense, IPendingItem, ITransaction } from '~/models';
import { budgetService } from '~/services';
import { IWeekState } from '~/redux';
import cx from 'classnames';
import styles from './Statistics.module.css';

export interface IStatisticsProps {
	incomes: IIncome[];
	expenses: IExpense[];
	pendingItems: IPendingItem[];
	weeks: IWeekState[];
	allWeeksInYear: IWeekState[];
	expenseTransactions: Record<string, ITransaction[]>;
}

export function Statistics({
	incomes,
	expenses,
	pendingItems,
	weeks,
	allWeeksInYear,
	expenseTransactions
}: IStatisticsProps) {
	const isLoading =
		!incomes ||
		!expenses ||
		weeks.some(week => week === undefined || week.isLoading) ||
		allWeeksInYear.some(week => week === undefined || week.isLoading);
	if (isLoading) {
		return <PageLoading message='Loading transactions' />;
	}

	const weeklyBudget = budgetService.getWeeklyBudget(incomes, expenses);
	const totalSpends = weeks.map((week, index) =>
		budgetService.getTotalSpend(
			week.transactions,
			index === 0 ? pendingItems : [],
			incomes,
			expenses,
			expenseTransactions
		)
	);
	const extraIncomes = weeks.map(week =>
		budgetService.getExtraIncome(week.transactions, incomes, expenses)
	);
	const totalExtraIncome = extraIncomes.reduce(
		(total, extraIncome) => total + extraIncome,
		0
	);
	const remainingBudgets = totalSpends.map(
		totalSpend => weeklyBudget - totalSpend
	);
	const totalRemainingBudget = remainingBudgets.reduce(
		(total, remainingBudget) => total + remainingBudget,
		0
	);
	const maxUnderBudget = Math.max(0, ...remainingBudgets);
	const maxOverBudget = Math.min(0, ...remainingBudgets);
	const netResult = totalRemainingBudget + totalExtraIncome;

	const weekTotals = allWeeksInYear.map(
		(week, index) =>
			weeklyBudget -
			budgetService.getTotalSpend(
				week.transactions,
				index === 0 ? pendingItems : [],
				incomes,
				expenses,
				expenseTransactions
			) +
			budgetService.getExtraIncome(week.transactions, incomes, expenses)
	);
	const yearTotal = weekTotals.reduce((sum, amount) => sum + amount, 0);

	return (
		<div>
			<h2 className={styles.h2}>Last {weeks.length} Weeks</h2>
			<div className={styles.graph}>
				{remainingBudgets.map((remainingBudget, index) => (
					<Week
						key={index}
						remainingBudget={remainingBudget}
						maxUnderBudget={maxUnderBudget}
						maxOverBudget={maxOverBudget}
					/>
				))}
			</div>
			{totalRemainingBudget >= 0 && (
				<div className={styles.row}>
					Total Under (Last {weeks.length} Weeks)
					<span className={styles.gain}>
						{budgetService.format(totalRemainingBudget)}
					</span>
				</div>
			)}
			{totalRemainingBudget < 0 && (
				<div className={styles.row}>
					Total Over (Last {weeks.length} Weeks)
					<span className={styles.loss}>
						{budgetService.format(-totalRemainingBudget)}
					</span>
				</div>
			)}
			{yearTotal >= 0 && (
				<div className={styles.row}>
					Total Under (Entire Year)
					<span className={styles.gain}>
						{budgetService.format(yearTotal)}
					</span>
				</div>
			)}
			{yearTotal < 0 && (
				<div className={styles.row}>
					Total Over (Entire Year)
					<span className={styles.loss}>
						{budgetService.format(-yearTotal)}
					</span>
				</div>
			)}
			{totalExtraIncome > 0 && (
				<>
					<div className={styles.row}>
						Total Extra Income
						<span className={styles.gain}>
							{budgetService.format(totalExtraIncome)}
						</span>
					</div>
					{netResult >= 0 && (
						<div className={styles.row}>
							Net Gain
							<span className={cx(styles.net, styles.gain)}>
								{budgetService.format(netResult)}
							</span>
						</div>
					)}
					{netResult < 0 && (
						<div className={styles.row}>
							Net Loss
							<span className={cx(styles.net, styles.loss)}>
								{budgetService.format(-netResult)}
							</span>
						</div>
					)}
				</>
			)}
			{expenses
				.filter(expense => expense.isDistributed)
				.map(expense => (
					<ExpenseBudget
						key={expense.name}
						expense={expense}
						total={budgetService.getTotal(
							expenseTransactions[expense.name]
						)}
					/>
				))}
		</div>
	);
}
