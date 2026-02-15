import { Card, HorizontalLayout, VerticalLayout } from "~/components";
import { Button } from "@mui/material";
import { Expense } from "./Expense";
import { IExpense } from "~/models";
import { budgetService } from "~/services";

export interface ICategoryProps {
	category: string;
	expenses: IExpense[];
	onAddExpense(): void;
	onEditExpense(expense: IExpense): void;
}

export function Category({
	category,
	expenses,
	onAddExpense,
	onEditExpense,
}: ICategoryProps) {
	const createEditClickedHandler = (expense: IExpense) => () => {
		onEditExpense(expense);
	};

	const weeklyExpenses = budgetService.getWeeklyExpenses(expenses);

	return (
		<Card>
			<VerticalLayout>
				<HorizontalLayout
					verticalAlign="center"
					horizontalAlign="justified"
				>
					<HorizontalLayout verticalAlign="center">
						<h3>{category}</h3>
						<h4>
							{budgetService.format(weeklyExpenses)} every week
						</h4>
					</HorizontalLayout>
					<Button variant="contained" color="primary" onClick={onAddExpense}>
						Add
					</Button>
				</HorizontalLayout>
				{[...expenses]
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((expense) => (
						<Expense
							key={expense.name}
							expense={expense}
							onEdit={createEditClickedHandler(expense)}
						/>
					))}
			</VerticalLayout>
		</Card>
	);
}
