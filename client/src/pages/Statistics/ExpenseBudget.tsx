import { Link } from "react-router-dom";
import { IExpense } from "~/models";
import { budgetService } from "~/services";
import { clsx } from "clsx";
import styles from "./ExpenseBudget.module.css";

export interface IExpenseBudgetProps {
	expense: IExpense;
	total: number;
}

export function ExpenseBudget({ expense, total }: IExpenseBudgetProps) {
	return (
		<Link className={styles.root} to={`/yearly-expenses/${expense.id}`}>
			Remaining {expense.name} Budget
			<span
				className={clsx(
					styles.net,
					expense.amount >= total && styles.gain,
					expense.amount < total && styles.loss,
				)}
			>
				{budgetService.format(Math.abs(expense.amount - total))}
			</span>
		</Link>
	);
}
