import React from 'react';
import { budgetService } from '~/services';
import { IIncome, IExpense } from '~/models';
import styles from './BudgetView.css';

export interface IBudgetViewProps {
	incomes: IIncome[];
	expenses: IExpense[];
}

export default function BudgetView({
	incomes,
	expenses
}: IBudgetViewProps) {
	const weeklyBudget = budgetService.getWeeklyBudget(incomes, expenses);
	return (
		<div className={styles.root}>
			Budget {budgetService.format(weeklyBudget)}
		</div>
	);
}
