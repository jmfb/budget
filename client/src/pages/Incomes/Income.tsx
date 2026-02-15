import { useAsyncState } from "~/hooks";
import { HorizontalLayout } from "~/components";
import { Button } from "@mui/material";
import { IIncome } from "~/models";
import { budgetService } from "~/services";
import { incomesActions } from "~/redux";

export interface IIncomeProps {
	income: IIncome;
	onEdit(): void;
}

export function Income({ income, onEdit }: IIncomeProps) {
	const { name, amount, weeksInterval } = income;
	const interval =
		weeksInterval === 1
			? "every week"
			: weeksInterval === 52
				? "every year"
				: `every ${weeksInterval} weeks`;

	const { isLoading: isDeleting, invoke: deleteIncome } = useAsyncState(
		incomesActions.deleteIncome,
	);

	const handleDeleteClicked = () => {
		deleteIncome(income.id);
	};

	return (
		<HorizontalLayout verticalAlign="center" horizontalAlign="justified">
			<span>
				{name} - {budgetService.format(amount)} {interval}
			</span>
			<HorizontalLayout>
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
			</HorizontalLayout>
		</HorizontalLayout>
	);
}
