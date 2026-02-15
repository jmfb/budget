import { Grid, Button, Card, CardContent, Typography } from "@mui/material";
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
			<CardContent>
				<Grid container direction="column" spacing={2}>
					<Grid
						container
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Grid
							container
							direction="row"
							alignItems="center"
							spacing={2}
						>
							<Typography variant="h5">{category}</Typography>
							<Typography variant="h6">
								{budgetService.format(weeklyExpenses)} every
								week
							</Typography>
						</Grid>
						<Button
							variant="contained"
							color="primary"
							onClick={onAddExpense}
						>
							Add
						</Button>
					</Grid>
					{[...expenses]
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((expense) => (
							<Expense
								key={expense.name}
								expense={expense}
								onEdit={createEditClickedHandler(expense)}
							/>
						))}
				</Grid>
			</CardContent>
		</Card>
	);
}
