import React from 'react';
import { budgetService } from '~/services';
import { IIncome, IExpense, ITransaction } from '~/models';
import styles from './BudgetView.css';

export interface IBudgetViewProps {
	incomes: IIncome[];
	expenses: IExpense[];
	transactions: ITransaction[];
}

export default function BudgetView({
	incomes,
	expenses,
	transactions
}: IBudgetViewProps) {
	const weeklyBudget = budgetService.getWeeklyBudget(incomes, expenses);
	const totalSpend = budgetService.getTotalSpend(transactions, incomes, expenses);
	const extraIncome = budgetService.getExtraIncome(transactions, incomes, expenses);
	return (
		<div className={styles.root}>
			<div>Budget {budgetService.format(weeklyBudget)}</div>
			{transactions &&
				<>
					<div>Spend {budgetService.format(totalSpend)}</div>
					{totalSpend <= weeklyBudget ?
						<div>Remaining {budgetService.format(weeklyBudget - totalSpend)}</div> :
						<div>Over {budgetService.format(totalSpend - weeklyBudget)}</div>
					}
					{extraIncome > 0 &&
						<div>Extra Income {budgetService.format(extraIncome)}</div>
					}
				</>
			}
		</div>
	);
}
