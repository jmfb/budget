import { useAsyncState } from "~/hooks";
import { Grid, Button, Typography } from "@mui/material";
import { IExpense } from "~/models";
import { budgetService } from "~/services";
import { expensesActions } from "~/redux";

export interface IExpenseProps {
	expense: IExpense;
	onEdit(): void;
}

export function Expense({ expense, onEdit }: IExpenseProps) {
	const { name, amount, monthsInterval, isDistributed } = expense;
	const interval = isDistributed
		? monthsInterval === 1
			? "over a month"
			: `over ${monthsInterval} months`
		: monthsInterval === 1
			? "every month"
			: `every ${monthsInterval} months`;

	const { isLoading: isDeleting, invoke: deleteExpense } = useAsyncState(
		expensesActions.deleteExpense,
	);

	const handleDeleteClicked = () => {
		deleteExpense(expense.id);
	};

	return (
		<Grid
			container
			direction="row"
			justifyContent="space-between"
			alignItems="center"
		>
			<Typography variant="body1">
				{name} - {budgetService.format(amount)} {interval}
			</Typography>
			<Grid container direction="row" spacing={2}>
				<Button variant="outlined" color="primary" onClick={onEdit}>
					Edit
				</Button>
				<Button
					variant="contained"
					color="error"
					onClick={handleDeleteClicked}
					loading={isDeleting}
					disabled={isDeleting}
				>
					Delete
				</Button>
			</Grid>
		</Grid>
	);
}
