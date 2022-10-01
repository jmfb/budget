import React from 'react';
import { PageLoading } from '~/components';
import { Week } from './Week';
import { ExpenseBudget } from './ExpenseBudget';
import { IIncome, IExpense, IWeeklyTransactions, IPendingItem } from '~/models';
import { budgetService } from '~/services';
import cx from 'classnames';
import styles from './Statistics.css';

export interface IStatisticsProps {
	incomes: IIncome[];
	expenses: IExpense[];
	pendingItems: IPendingItem[];
	weeks: IWeeklyTransactions[];
}

export function Statistics({
	incomes,
	expenses,
	pendingItems,
	weeks
}: IStatisticsProps) {
	const isLoading =
		!incomes ||
		!expenses ||
		weeks.some(week => week === undefined || week.isLoading);
	if (isLoading) {
		return <PageLoading message='Loading transactions' />;
	}

	const getWeekExpenseTotal = (expenseName: string) => {
		return weeks[0].transactions
			.filter(transaction => transaction.expenseName === expenseName)
			.reduce((total, transaction) => total + transaction.amount, 0);
	};

	const { yearlyExpenseTotals } = weeks[0];
	const weeklyBudget = budgetService.getWeeklyBudget(incomes, expenses);
	const totalSpends = weeks.map((week, index) =>
		budgetService.getTotalSpend(
			week.transactions,
			index === 0 ? pendingItems : [],
			incomes,
			expenses,
			week.yearlyExpenseTotals
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

	return (
		<div>
			<h2 className={styles.h2}>Last {weeks.length} Weeks</h2>
			<div className={styles.graph}>
				{remainingBudgets.map((remainingBudget, index) => (
					<Week
						key={index}
						{...{
							remainingBudget,
							maxUnderBudget,
							maxOverBudget
						}}
					/>
				))}
			</div>
			{totalRemainingBudget >= 0 && (
				<div className={styles.row}>
					Total Under
					<span className={styles.gain}>
						{budgetService.format(totalRemainingBudget)}
					</span>
				</div>
			)}
			{totalRemainingBudget < 0 && (
				<div className={styles.row}>
					Total Over
					<span className={styles.loss}>
						{budgetService.format(-totalRemainingBudget)}
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
				.map(expense => ({
					expense,
					total:
						yearlyExpenseTotals[expense.name] ??
						0 + getWeekExpenseTotal(expense.name)
				}))
				.map(item => (
					<ExpenseBudget
						key={item.expense.name}
						{...item}
					/>
				))}
		</div>
	);
}
