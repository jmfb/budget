import { useEffect, useState } from "react";
import { PageLoading, Button } from "~/components";
import { Income } from "./Income";
import { IncomeEditor } from "./IncomeEditor";
import { budgetService, dateService } from "~/services";
import { IIncome, IUpdateIncomeRequest } from "~/models";
import styles from "./Incomes.module.css";
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
		<div>
			<div className={styles.header}>
				<h2 className={styles.heading}>Incomes</h2>
				<h3 className={styles.heading}>
					{budgetService.format(weeklyIncomes)} every week
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
				{incomes.map((income) => (
					<Income
						key={income.name}
						income={income}
						onEdit={createEditClickedHandler(income)}
					/>
				))}
			</div>
			{showEditor && (
				<IncomeEditor
					existingIncome={existingIncome!}
					isSavingIncome={isCreating || isUpdating}
					onSave={handleSaveClicked}
					onCancel={closeEditor}
				/>
			)}
		</div>
	);
}
