import React, { useState } from 'react';
import {
	Modal,
	Button,
	Input,
	CurrencyInput,
	NumberInput,
	Checkbox,
	CategorySelect
} from '~/components';
import { IExpense } from '~/models';
import styles from './ExpenseEditor.css';

export interface IExpenseEditorProps {
	existingExpense: IExpense;
	isSavingExpense: boolean;
	onSave(expense: IExpense): void;
	onCancel(): void;
}

export default function ExpenseEditor({
	existingExpense,
	isSavingExpense,
	onSave,
	onCancel
}: IExpenseEditorProps) {
	const [name, setName] = useState(existingExpense?.name ?? '');
	const [amount, setAmount] = useState(existingExpense?.amount ?? 0);
	const [monthsInterval, setMonthsInterval] = useState(
		existingExpense?.monthsInterval ?? 1
	);
	const [category, setCategory] = useState(existingExpense?.category ?? '');
	const [isDistributed, setIsDistributed] = useState(
		existingExpense?.isDistributed ?? false
	);

	const handleIsDistributedChanged = (value: boolean) => {
		if (value) {
			setMonthsInterval(12);
		}
		setIsDistributed(value);
	};

	const handleSaveClicked = () => {
		onSave({ name, amount, monthsInterval, category, isDistributed });
	};

	const isValidName = !!name;
	const isValidAmount = amount > 0;
	const isValidInterval = !isDistributed || monthsInterval === 12;
	const isValidCategory = !!category;
	const isValid =
		isValidName && isValidAmount && isValidInterval && isValidCategory;

	return (
		<Modal onClose={onCancel}>
			<h3>{existingExpense ? name : 'New Expense'}</h3>
			<div className={styles.inputs}>
				{!existingExpense && (
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
				<Checkbox
					name='Is Distributed Over Entire Year?'
					value={isDistributed}
					onChange={handleIsDistributedChanged}
				/>
				{!isDistributed && (
					<NumberInput
						name='Months Interval'
						value={monthsInterval}
						onChange={setMonthsInterval}
					/>
				)}
				<CategorySelect
					{...{ category }}
					onChange={setCategory}
				/>
			</div>
			<hr />
			<div className={styles.buttons}>
				<Button
					onClick={handleSaveClicked}
					isDisabled={!isValid || isSavingExpense}
					isProcessing={isSavingExpense}
					className={styles.saveButton}>
					Save
				</Button>
				<Button
					onClick={onCancel}
					isDisabled={isSavingExpense}>
					Cancel
				</Button>
			</div>
		</Modal>
	);
}
