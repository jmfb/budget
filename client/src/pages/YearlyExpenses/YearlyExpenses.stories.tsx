import { Meta, StoryObj } from "@storybook/react";
import { YearlyExpenses } from "./YearlyExpenses";
import { fn } from "@storybook/test";
import { IExpense, ITransaction } from "~/models";
import { makeStoreDecorator } from "~/decorators";

const meta = {
	component: YearlyExpenses,
	args: {
		expense: {
			name: "Weekly groceries",
			amount: 300,
		} as IExpense,
		categoryName: "Groceries",
		yearlyExpenses: [],
		isSavingExpense: false,
		savingExpenseSuccess: false,
		onSave: fn(),
	},
	decorators: [makeStoreDecorator()],
} satisfies Meta<typeof YearlyExpenses>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const loading: Story = { args: { expense: null } };

export const saving: Story = { args: { isSavingExpense: true } };

export const withTransactions: Story = {
	args: {
		yearlyExpenses: [
			{
				id: 1,
				amount: 100,
				note: "This is the note",
				description: "Description of item",
				date: "2025-03-25",
			},
			{
				id: 2,
				amount: 50,
				note: "Something else",
				description: "",
				date: "2025-03-25",
			},
			{
				id: 3,
				amount: 25,
				note: "Different day",
				description: "With another description",
				date: "2025-04-01",
			},
		] as ITransaction[],
	},
};

export const atBudgetLimit: Story = {
	args: {
		yearlyExpenses: [
			{
				id: 1,
				amount: 300,
				note: "This is the note",
				description: "Description of item",
				date: "2025-03-25",
			},
		] as ITransaction[],
	},
};

export const overBudget: Story = {
	args: {
		yearlyExpenses: [
			{
				id: 1,
				amount: 400,
				note: "This is the note",
				description: "Description of item",
				date: "2025-03-25",
			},
		] as ITransaction[],
	},
};
