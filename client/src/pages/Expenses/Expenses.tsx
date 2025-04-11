import { useEffect, useState } from "react";
import {
	PageLoading,
	Button,
	VerticalLayout,
	HorizontalLayout,
} from "~/components";
import { Category } from "./Category";
import { ExpenseEditor } from "./ExpenseEditor";
import { budgetService, dateService } from "~/services";
import { ICategory, IExpense, IUpdateExpenseRequest } from "~/models";
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
	const [defaultCategoryId, setDefaultCategoryId] = useState<number | null>(
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

	const { isLoading: isImporting, invoke: importPreviousYearExpenses } =
		useAsyncState(expensesActions.importPreviousYearExpenses);

	const handleAddClicked = () => {
		setShowEditor(true);
		setDefaultCategoryId(null);
	};
	const createAddCategoryExpenseHandler = (categoryId: number) => () => {
		setShowEditor(true);
		setDefaultCategoryId(categoryId);
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
		setDefaultCategoryId(null);
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

	const expensesByCategoryId = expenses.reduce(
		(map, expense) => {
			if (map[expense.categoryId]) {
				map[expense.categoryId].push(expense);
			} else {
				map[expense.categoryId] = [expense];
			}
			return map;
		},
		{} as Record<number, IExpense[]>,
	);
	const sortedCategoryIds = Object.keys(expensesByCategoryId)
		.map(Number)
		.sort((a, b) =>
			categoryById[a].name.localeCompare(categoryById[b].name),
		);

	const weeklyExpenses = budgetService.getWeeklyExpenses(expenses);
	return (
		<VerticalLayout>
			<HorizontalLayout
				verticalAlign="center"
				horizontalAlign="justified"
			>
				<HorizontalLayout verticalAlign="center">
					<h2>Expenses</h2>
					<h3>{budgetService.format(weeklyExpenses)} every week</h3>
				</HorizontalLayout>
				<Button variant="primary" onClick={handleAddClicked}>
					Add
				</Button>
			</HorizontalLayout>
			{sortedCategoryIds.map((categoryId) => (
				<Category
					key={categoryId}
					category={categoryById[categoryId].name}
					expenses={expensesByCategoryId[categoryId]}
					onAddExpense={createAddCategoryExpenseHandler(categoryId)}
					onEditExpense={handleEditExpense}
				/>
			))}
			{expenses.length === 0 && (
				<HorizontalLayout>
					<Button
						variant="default"
						isProcessing={isImporting}
						isDisabled={isImporting}
						onClick={importPreviousYearExpenses}
					>
						Import expenses from {new Date().getFullYear() - 1}
					</Button>
				</HorizontalLayout>
			)}
			{showEditor && (
				<ExpenseEditor
					existingExpense={existingExpense}
					defaultCategoryId={defaultCategoryId}
					isSavingExpense={isCreating || isUpdating}
					onSave={handleSaveClicked}
					onCancel={closeEditor}
				/>
			)}
		</VerticalLayout>
	);
}
