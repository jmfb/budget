import { Meta, StoryObj } from "@storybook/react";
import { IncomeEditor } from "./IncomeEditor";
import { fn } from "@storybook/test";

const meta = {
	component: IncomeEditor,
	args: {
		existingIncome: null,
		isSavingIncome: false,
		onSave: fn(),
		onCancel: fn(),
	},
} satisfies Meta<typeof IncomeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const newIncome: Story = {};

export const existing: Story = {
	args: {
		existingIncome: {
			id: 1,
			year: 2024,
			name: "Income name",
			amount: 1000,
			weeksInterval: 2,
		},
	},
};

export const saving: Story = { args: { isSavingIncome: true } };
