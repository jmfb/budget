import { useState, type ChangeEvent } from "react";
import {
	Modal,
	Input,
	CurrencyInput,
	NumberField,
	CategorySelect,
} from "~/components";
import { Button, FormControlLabel, Checkbox } from "@mui/material";
import { IExpense, IUpdateExpenseRequest } from "~/models";
import { budgetService } from "~/services";

export interface IExpenseEditorProps {
	existingExpense: IExpense | null;
	defaultCategoryId?: number | null;
	isSavingExpense: boolean;
	mustRemainYearlyExpense?: boolean;
	onSave(expense: IUpdateExpenseRequest): void;
	onCancel(): void;
}

export function ExpenseEditor({
	existingExpense,
	defaultCategoryId,
	isSavingExpense,
	mustRemainYearlyExpense,
	onSave,
	onCancel,
}: IExpenseEditorProps) {
	const [name, setName] = useState(existingExpense?.name ?? "");
	const [amountString, setAmountString] = useState(
		existingExpense?.amount.toString() ?? "",
	);
	const [monthsInterval, setMonthsInterval] = useState<number | null>(
		existingExpense?.monthsInterval ?? 1,
	);
	const [categoryId, setCategoryId] = useState(
		existingExpense?.categoryId ?? defaultCategoryId ?? null,
	);
	const [isDistributed, setIsDistributed] = useState(
		existingExpense?.isDistributed ?? false,
	);

	const isValidName = !!name;
	const parsedAmount = budgetService.parseCurrency(amountString);
	const isValidAmount = parsedAmount !== null && parsedAmount > 0;
	const isValidInterval =
		!isDistributed || (monthsInterval !== null && monthsInterval === 12);
	const isValidCategory = categoryId !== null;
	const isValid =
		isValidName && isValidAmount && isValidInterval && isValidCategory;

	const handleIsDistributedChanged = (
		_: ChangeEvent<HTMLInputElement>,
		value: boolean,
	) => {
		if (value) {
			setMonthsInterval(12);
		}
		setIsDistributed(value);
	};
	const handleSaveClicked = () => {
		onSave({
			name,
			amount: parsedAmount ?? 0,
			monthsInterval: monthsInterval ?? 1,
			categoryId: categoryId ?? 0,
			isDistributed,
		});
	};
	const handleCancelClicked = () => {
		if (!isSavingExpense) {
			onCancel();
		}
	};

	return (
		<Modal
			onClose={handleCancelClicked}
			title={existingExpense ? "Edit Expense" : "New Expense"}
			buttons={
				<>
					<Button
						variant="outlined"
						color="primary"
						onClick={handleCancelClicked}
						disabled={isSavingExpense}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSaveClicked}
						disabled={!isValid || isSavingExpense}
						loading={isSavingExpense}
					>
						Save
					</Button>
				</>
			}
		>
			<Input
				name="Name"
				autoFocus={!existingExpense}
				value={name}
				isDisabled={isSavingExpense}
				onChange={setName}
			/>
			<CurrencyInput
				name="Amount"
				autoFocus={!!existingExpense}
				value={amountString}
				isDisabled={isSavingExpense}
				onChange={setAmountString}
			/>
			{!mustRemainYearlyExpense && (
				<>
					<FormControlLabel
						label="Is Distributed Over Entire Year?"
						control={
							<Checkbox
								value={isDistributed}
								disabled={isSavingExpense}
								onChange={handleIsDistributedChanged}
							/>
						}
					/>
					{!isDistributed && (
						<NumberField
							label="Months Interval"
							value={monthsInterval}
							size="small"
							disabled={isSavingExpense}
							onValueChange={setMonthsInterval}
						/>
					)}
				</>
			)}
			<CategorySelect
				categoryId={categoryId}
				isDisabled={isSavingExpense}
				onChange={setCategoryId}
			/>
		</Modal>
	);
}
