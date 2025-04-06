import { Card } from "~/components";
import { Expense } from "./Expense";
import { IExpense } from "~/models";
import { budgetService } from "~/services";
import styles from "./Category.module.css";

export interface ICategoryProps {
	category: string;
	expenses: IExpense[];
	onEditExpense(expense: IExpense): void;
}

export function Category({
	category,
	expenses,
	onEditExpense,
}: ICategoryProps) {
	const createEditClickedHandler = (expense: IExpense) => () => {
		onEditExpense(expense);
	};

	const weeklyExpenses = budgetService.getWeeklyExpenses(expenses);

	return (
		<Card className={styles.category}>
			<div className={styles.header}>
				<h3 className={styles.heading}>{category}</h3>
				<h4 className={styles.heading}>
					{budgetService.format(weeklyExpenses)} every week
				</h4>
			</div>
			{[...expenses]
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((expense) => (
					<Expense
						key={expense.name}
						expense={expense}
						onEdit={createEditClickedHandler(expense)}
					/>
				))}
		</Card>
	);
}
