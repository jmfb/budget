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

	const isValidName = !!name;
	const isValidAmount = amount > 0;
	const isValidInterval = !isDistributed || monthsInterval === 12;
	const isValidCategory = categoryId !== null;
	const isValid =
		isValidName && isValidAmount && isValidInterval && isValidCategory;

	return (
		<Modal
			onClose={onCancel}
			title={existingExpense ? name : "New Expense"}
			buttons={
				<Buttons>
					<Button
						variant="default"
						onClick={onCancel}
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
			<Input name="Name" autoFocus value={name} onChange={setName} />
			<CurrencyInput
				name="Amount"
				autoFocus={!!existingExpense}
				value={amount}
				onChange={setAmount}
			/>
			{!mustRemainYearlyExpense && (
				<>
					<Checkbox
						name="Is Distributed Over Entire Year?"
						value={isDistributed}
						onChange={handleIsDistributedChanged}
					/>
					{!isDistributed && (
						<NumberInput
							name="Months Interval"
							value={monthsInterval}
							onChange={setMonthsInterval}
						/>
					)}
				</>
			)}
			<CategorySelect categoryId={categoryId} onChange={setCategoryId} />
		</Modal>
	);
}
