import { useEffect, useState } from "react";
import { PageLoading, VerticalLayout, HorizontalLayout } from "~/components";
import { Button } from "@mui/material";
import { Income } from "./Income";
import { IncomeEditor } from "./IncomeEditor";
import { budgetService, dateService } from "~/services";
import { IIncome, IUpdateIncomeRequest } from "~/models";
import { useAsyncState } from "~/hooks";
import { incomesActions } from "~/redux";

export interface IIncomesProps {
	incomes: IIncome[];
}

export function Incomes({ incomes }: IIncomesProps) {
	const [showEditor, setShowEditor] = useState(false);
	const [existingIncome, setExistingIncome] = useState<IIncome | null>(null);

	const {
		isLoading: isUpdating,
		wasSuccessful: updateSuccessful,
		clear: clearUpdate,
		invoke: updateIncome,
	} = useAsyncState(incomesActions.updateIncome);

	const {
		isLoading: isCreating,
		wasSuccessful: createSuccessful,
		clear: clearCreate,
		invoke: createIncome,
	} = useAsyncState(incomesActions.createIncome);

	const { isLoading: isImporting, invoke: importPreviousYearIncomes } =
		useAsyncState(incomesActions.importPreviousYearIncomes);

	const handleAddClicked = () => {
		setShowEditor(true);
	};
	const createEditClickedHandler = (income: IIncome) => () => {
		setShowEditor(true);
		setExistingIncome(income);
	};
	const handleSaveClicked = (request: IUpdateIncomeRequest) => {
		clearUpdate();
		clearCreate();
		if (existingIncome) {
			updateIncome({ incomeId: existingIncome.id, request });
		} else {
			createIncome({ ...request, year: dateService.getCurrentYear() });
		}
	};

	const closeEditor = () => {
		setShowEditor(false);
		setExistingIncome(null);
	};

	useEffect(() => {
		if (updateSuccessful || createSuccessful) {
			clearUpdate();
			clearCreate();
			closeEditor();
		}
	}, [updateSuccessful, createSuccessful]);

	if (incomes === null) {
		return <PageLoading message="Loading incomes" />;
	}

	const weeklyIncomes = budgetService.getWeeklyIncomes(incomes);
	return (
		<VerticalLayout>
			<HorizontalLayout
				verticalAlign="center"
				horizontalAlign="justified"
			>
				<HorizontalLayout verticalAlign="center">
					<h2>Incomes</h2>
					{weeklyIncomes > 0 && (
						<h3>
							{budgetService.format(weeklyIncomes)} every week
						</h3>
					)}
				</HorizontalLayout>
				<Button
					variant="contained"
					color="primary"
					onClick={handleAddClicked}
				>
					Add
				</Button>
			</HorizontalLayout>
			{incomes.map((income) => (
				<Income
					key={income.name}
					income={income}
					onEdit={createEditClickedHandler(income)}
				/>
			))}
			{incomes.length === 0 && (
				<HorizontalLayout>
					<Button
						variant="outlined"
						color="primary"
						loading={isImporting}
						disabled={isImporting}
						onClick={() => importPreviousYearIncomes()}
					>
						Import incomes from {new Date().getFullYear() - 1}
					</Button>
				</HorizontalLayout>
			)}
			{showEditor && (
				<IncomeEditor
					existingIncome={existingIncome!}
					isSavingIncome={isCreating || isUpdating}
					onSave={handleSaveClicked}
					onCancel={closeEditor}
				/>
			)}
		</VerticalLayout>
	);
}
