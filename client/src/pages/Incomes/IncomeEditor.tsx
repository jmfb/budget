import React, { useState } from 'react';
import { Modal, Button, Input, CurrencyInput, NumberInput } from '~/components';
import { IIncome } from '~/models';
import styles from './IncomeEditor.css';

export interface IIncomeEditorProps {
	existingIncome: IIncome;
	isSavingIncome: boolean;
	onSave(income: IIncome): void;
	onCancel(): void;
}

export default function IncomeEditor({
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
		<Modal onClose={onCancel}>
			<h3>{existingIncome ? name : 'New Income'}</h3>
			<div className={styles.inputs}>
				{!existingIncome && (
					<Input
						name='Name'
						value={name}
						onChange={setName}
					/>
				)}
				<CurrencyInput
					name='Amount'
					value={amount}
					onChange={setAmount}
				/>
				<NumberInput
					name='Weeks Interval'
					value={weeksInterval}
					onChange={setWeeksInterval}
				/>
			</div>
			<hr />
			<div className={styles.buttons}>
				<Button
					onClick={handleSaveClicked}
					isDisabled={isSavingIncome}
					isProcessing={isSavingIncome}
					className={styles.saveButton}>
					Save
				</Button>
				<Button
					onClick={onCancel}
					isDisabled={isSavingIncome}>
					Cancel
				</Button>
			</div>
		</Modal>
	);
}
