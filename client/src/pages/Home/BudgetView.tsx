import React from 'react';
import { budgetService } from '~/services';
import {
	IIncome,
	IExpense,
	ITransaction,
	IPendingItem,
	IExpenseTotals
} from '~/models';
import styles from './BudgetView.css';

export interface IBudgetViewProps {
	incomes: IIncome[];
	expenses: IExpense[];
	transactions: ITransaction[];
	pendingItems: IPendingItem[];
	yearlyExpenseTotals: IExpenseTotals;
}

export default function BudgetView({
	incomes,
	expenses,
	transactions,
	pendingItems,
	yearlyExpenseTotals
}: IBudgetViewProps) {
	const weeklyBudget = budgetService.getWeeklyBudget(incomes, expenses);
	const totalSpend = budgetService.getTotalSpend(
		transactions,
		pendingItems,
		incomes,
		expenses,
		yearlyExpenseTotals
	);
	const extraIncome = budgetService.getExtraIncome(
		transactions,
		incomes,
		expenses
	);
	const remainingBudget = weeklyBudget - totalSpend;
	return (
		<div className={styles.root}>
			<div className={styles.labels}>
				{remainingBudget >= 0 ? (
					<span className={styles.remaining}>
						Remaining {budgetService.format(remainingBudget)}
					</span>
				) : (
					<span className={styles.over}>
						Over {budgetService.format(-remainingBudget)}
					</span>
				)}
				<span className={styles.budget}>
					Budget {budgetService.format(weeklyBudget)}
				</span>
			</div>
			{remainingBudget >= 0 && (
				<meter
					className={styles.meter}
					min={0}
					max={weeklyBudget}
					low={weeklyBudget / 10}
					high={weeklyBudget / 2}
					optimum={weeklyBudget}
					value={remainingBudget}
				/>
			)}
			{remainingBudget < 0 && (
				<meter
					className={styles.meter}
					min={0}
					max={1}
					low={0.25}
					high={0.5}
					optimum={0.1}
					value={1}
				/>
			)}
			<div className={styles.labels}>
				<span className={styles.spend}>
					Spent {budgetService.format(totalSpend)}
				</span>
				{extraIncome > 0 && (
					<span className={styles.extraIncome}>
						Extra Income {budgetService.format(extraIncome)}
					</span>
				)}
			</div>
		</div>
	);
}
