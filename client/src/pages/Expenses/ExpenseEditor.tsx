import { useState } from "react";
import {
	Modal,
	Button,
	Buttons,
	Input,
	CurrencyInput,
	NumberInput,
	Checkbox,
	CategorySelect,
} from "~/components";
import { IExpense, IUpdateExpenseRequest } from "~/models";

export interface IExpenseEditorProps {
	existingExpense: IExpense | null;
	isSavingExpense: boolean;
	mustRemainYearlyExpense?: boolean;
	onSave(expense: IUpdateExpenseRequest): void;
	onCancel(): void;
}

export function ExpenseEditor({
	existingExpense,
	isSavingExpense,
	mustRemainYearlyExpense,
	onSave,
	onCancel,
}: IExpenseEditorProps) {
	const [name, setName] = useState(existingExpense?.name ?? "");
	const [amount, setAmount] = useState(existingExpense?.amount ?? 0);
	const [monthsInterval, setMonthsInterval] = useState(
		existingExpense?.monthsInterval ?? 1,
	);
	const [categoryId, setCategoryId] = useState(
		existingExpense?.categoryId ?? null,
	);
	const [isDistributed, setIsDistributed] = useState(
		existingExpense?.isDistributed ?? false,
	);

	const handleIsDistributedChanged = (value: boolean) => {
		if (value) {
			setMonthsInterval(12);
		}
		setIsDistributed(value);
	};
	const handleSaveClicked = () => {
		onSave({
			name,
			amount,
			monthsInterval,
			categoryId: categoryId ?? 0,
			isDistributed,
		});
	};
	const handleCancelClicked = () => {
		if (!isSavingExpense) {
			onCancel();
		}
	};

	const isValidName = !!name;
	const isValidAmount = amount > 0;
	const isValidInterval = !isDistributed || monthsInterval === 12;
	const isValidCategory = categoryId !== null;
	const isValid =
		isValidName && isValidAmount && isValidInterval && isValidCategory;

	return (
		<Modal
			onClose={handleCancelClicked}
			title={existingExpense ? "Edit Expense" : "New Expense"}
			buttons={
				<Buttons>
					<Button
						variant="default"
						onClick={handleCancelClicked}
						isDisabled={isSavingExpense}
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleSaveClicked}
						isDisabled={!isValid || isSavingExpense}
						isProcessing={isSavingExpense}
					>
						Save
					</Button>
				</Buttons>
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
				value={amount}
				isDisabled={isSavingExpense}
				onChange={setAmount}
			/>
			{!mustRemainYearlyExpense && (
				<>
					<Checkbox
						name="Is Distributed Over Entire Year?"
						value={isDistributed}
						isDisabled={isSavingExpense}
						onChange={handleIsDistributedChanged}
					/>
					{!isDistributed && (
						<NumberInput
							name="Months Interval"
							value={monthsInterval}
							isDisabled={isSavingExpense}
							onChange={setMonthsInterval}
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
