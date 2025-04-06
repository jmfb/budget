import { useEffect, useState } from "react";
import { PageLoading, Button } from "~/components";
import { Category } from "./Category";
import { ExpenseEditor } from "./ExpenseEditor";
import { budgetService, dateService } from "~/services";
import { ICategory, IExpense, IUpdateExpenseRequest } from "~/models";
import styles from "./Expenses.module.css";
import { useAsyncState } from "~/hooks";
import { expensesActions } from "~/redux";

export interface IExpensesProps {
	expenses: IExpense[];
	categoryById: Record<number, ICategory>;
}

export function Expenses({ expenses, categoryById }: IExpensesProps) {
	const [showEditor, setShowEditor] = useState(false);
	const [existingExpense, setExistingExpense] = useState<IExpense | null>(
		null,
	);

	const {
		isLoading: isUpdating,
		wasSuccessful: updateSuccessful,
		clear: clearUpdate,
		invoke: updateExpense,
	} = useAsyncState(expensesActions.updateExpense);

	const {
		isLoading: isCreating,
		wasSuccessful: createSuccessful,
		clear: clearCreate,
		invoke: createExpense,
	} = useAsyncState(expensesActions.createExpense);

	const handleAddClicked = () => {
		setShowEditor(true);
	};

	const handleEditExpense = (expense: IExpense) => {
		setShowEditor(true);
		setExistingExpense(expense);
	};

	const handleSaveClicked = (request: IUpdateExpenseRequest) => {
		clearUpdate();
		clearCreate();
		if (existingExpense) {
			updateExpense({ expenseId: existingExpense.id, request });
		} else {
			createExpense({ ...request, year: dateService.getCurrentYear() });
		}
	};

	const closeEditor = () => {
		setShowEditor(false);
		setExistingExpense(null);
	};

	useEffect(() => {
		if (updateSuccessful || createSuccessful) {
			clearUpdate();
			clearCreate();
			closeEditor();
		}
	}, [updateSuccessful, createSuccessful]);

	if (expenses === null) {
		return <PageLoading message="Loading expenses" />;
	}

	const expensesByCategory = expenses.reduce(
		(map, expense) => {
			const categoryName = categoryById[expense.categoryId]?.name ?? "";
			const grouping = map[categoryName];
			if (!grouping) {
				map[categoryName] = [expense];
			} else {
				grouping.push(expense);
			}
			return map;
		},
		{} as Record<string, IExpense[]>,
	);

	const weeklyExpenses = budgetService.getWeeklyExpenses(expenses);
	return (
		<div>
			<div className={styles.header}>
				<h2 className={styles.heading}>Expenses</h2>
				<h3 className={styles.heading}>
					{budgetService.format(weeklyExpenses)} every week
				</h3>
				<Button
					variant="primary"
					className={styles.addButton}
					onClick={handleAddClicked}
				>
					Add
				</Button>
			</div>
			<div>
				{Object.keys(expensesByCategory)
					.sort((a, b) => a.localeCompare(b))
					.map((category) => (
						<Category
							key={category}
							category={category}
							expenses={expensesByCategory[category]}
							onEditExpense={handleEditExpense}
						/>
					))}
			</div>
			{showEditor && (
				<ExpenseEditor
					existingExpense={existingExpense}
					isSavingExpense={isCreating || isUpdating}
					onSave={handleSaveClicked}
					onCancel={closeEditor}
				/>
			)}
		</div>
	);
}
