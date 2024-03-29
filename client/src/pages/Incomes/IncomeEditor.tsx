import React, { useState } from 'react';
import {
	Modal,
	Button,
	Buttons,
	Input,
	CurrencyInput,
	NumberInput
} from '~/components';
import { IIncome } from '~/models';

export interface IIncomeEditorProps {
	existingIncome: IIncome;
	isSavingIncome: boolean;
	onSave(income: IIncome): void;
	onCancel(): void;
}

export function IncomeEditor({
	existingIncome,
	isSavingIncome,
	onSave,
	onCancel
}: IIncomeEditorProps) {
	const [name, setName] = useState(existingIncome?.name ?? '');
	const [amount, setAmount] = useState(existingIncome?.amount ?? 0);
	const [weeksInterval, setWeeksInterval] = useState(
		existingIncome?.weeksInterval ?? 1
	);

	const handleSaveClicked = () => {
		onSave({ name, amount, weeksInterval });
	};

	return (
		<Modal
			onClose={onCancel}
			title={existingIncome ? name : 'New Income'}
			buttons={
				<Buttons>
					<Button
						variant='default'
						onClick={onCancel}
						isDisabled={isSavingIncome}>
						Cancel
					</Button>
					<Button
						variant='primary'
						onClick={handleSaveClicked}
						isDisabled={isSavingIncome}
						isProcessing={isSavingIncome}>
						Save
					</Button>
				</Buttons>
			}>
			{!existingIncome && (
				<Input
					name='Name'
					autoFocus
					value={name}
					onChange={setName}
				/>
			)}
			<CurrencyInput
				name='Amount'
				autoFocus={!!existingIncome}
				value={amount}
				onChange={setAmount}
			/>
			<NumberInput
				name='Weeks Interval'
				value={weeksInterval}
				onChange={setWeeksInterval}
			/>
		</Modal>
	);
}
