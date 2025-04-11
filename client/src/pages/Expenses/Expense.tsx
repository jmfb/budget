import { useAsyncState } from "~/hooks";
import { Button, HorizontalLayout } from "~/components";
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
		<HorizontalLayout verticalAlign="center" horizontalAlign="justified">
			<span>
				{name} - {budgetService.format(amount)} {interval}
			</span>
			<HorizontalLayout>
				<Button variant="default" onClick={onEdit}>
					Edit
				</Button>
				<Button
					variant="danger"
					onClick={handleDeleteClicked}
					isProcessing={isDeleting}
					isDisabled={isDeleting}
				>
					Delete
				</Button>
			</HorizontalLayout>
		</HorizontalLayout>
	);
}
