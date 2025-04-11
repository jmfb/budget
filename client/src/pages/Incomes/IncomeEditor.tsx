import { useState } from "react";
import { Modal, Button, Input, CurrencyInput, NumberInput } from "~/components";
import { IIncome, IUpdateIncomeRequest } from "~/models";

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
	const [amount, setAmount] = useState(existingIncome?.amount ?? 0);
	const [weeksInterval, setWeeksInterval] = useState(
		existingIncome?.weeksInterval ?? 1,
	);

	const handleCancelClicked = () => {
		if (!isSavingIncome) {
			onCancel();
		}
	};
	const handleSaveClicked = () => {
		onSave({ name, amount, weeksInterval });
	};

	return (
		<Modal
			onClose={handleCancelClicked}
			title={existingIncome ? "Edit Income" : "New Income"}
			buttons={
				<>
					<Button
						variant="default"
						onClick={handleCancelClicked}
						isDisabled={isSavingIncome}
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleSaveClicked}
						isDisabled={isSavingIncome}
						isProcessing={isSavingIncome}
					>
						Save
					</Button>
				</>
			}
		>
			<Input
				name="Name"
				autoFocus={!existingIncome}
				isDisabled={isSavingIncome}
				value={name}
				onChange={setName}
			/>
			<CurrencyInput
				name="Amount"
				autoFocus={!!existingIncome}
				isDisabled={isSavingIncome}
				value={amount}
				onChange={setAmount}
			/>
			<NumberInput
				name="Weeks Interval"
				value={weeksInterval}
				isDisabled={isSavingIncome}
				onChange={setWeeksInterval}
			/>
		</Modal>
	);
}
