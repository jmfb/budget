import { ChangeEvent, useState } from "react";
import { CurrencyInput, NumberInput } from "~/components";
import {
	Grid,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from "@mui/material";
import { IIncome, IUpdateIncomeRequest } from "~/models";
import { budgetService } from "~/services";

export interface IIncomeEditorProps {
	existingIncome: IIncome | null;
	isSavingIncome: boolean;
	onSave(income: IUpdateIncomeRequest): void;
	onCancel(): void;
}

export function IncomeEditor({
	existingIncome,
	isSavingIncome,
	onSave,
	onCancel,
}: IIncomeEditorProps) {
	const [name, setName] = useState(existingIncome?.name ?? "");
	const [amountString, setAmountString] = useState(
		existingIncome?.amount.toString() ?? "",
	);
	const [weeksInterval, setWeeksInterval] = useState(
		existingIncome?.weeksInterval ?? 1,
	);

	const parsedAmount = budgetService.parseCurrency(amountString);

	const handleNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.currentTarget.value);
	};
	const handleCancelClicked = () => {
		if (!isSavingIncome) {
			onCancel();
		}
	};
	const handleSaveClicked = () => {
		onSave({ name, amount: parsedAmount ?? 0, weeksInterval });
	};

	return (
		<Dialog open onClose={handleCancelClicked}>
			<DialogTitle>
				{existingIncome ? "Edit Income" : "New Income"}
			</DialogTitle>
			<DialogContent>
				<Grid
					container
					direction="column"
					spacing={2}
					marginTop="0.5rem"
				>
					<TextField
						label="Name"
						variant="standard"
						autoFocus={!existingIncome}
						disabled={isSavingIncome}
						value={name}
						onChange={handleNameChanged}
					/>
					<CurrencyInput
						name="Amount"
						autoFocus={!!existingIncome}
						isDisabled={isSavingIncome}
						value={amountString}
						onChange={setAmountString}
					/>
					<NumberInput
						name="Weeks Interval"
						value={weeksInterval}
						isDisabled={isSavingIncome}
						onChange={setWeeksInterval}
					/>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					color="primary"
					onClick={handleCancelClicked}
					disabled={isSavingIncome}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSaveClicked}
					disabled={isSavingIncome}
					loading={isSavingIncome}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
