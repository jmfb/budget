import { Meta, StoryObj } from "@storybook/react";
import { Expense } from "./Expense";
import { fn } from "@storybook/test";
import { makeStoreDecorator } from "~/decorators";

const defaultExpense = {
	id: 1,
	year: 2024,
	categoryId: 2,
	name: "Internet",
	amount: 100,
	monthsInterval: 1,
	isDistributed: false,
};

const meta = {
	component: Expense,
	args: {
		expense: defaultExpense,
		onEdit: fn(),
	},
	decorators: [makeStoreDecorator()],
} satisfies Meta<typeof Expense>;

export default meta;
type Story = StoryObj<typeof meta>;

export const everyMonth: Story = {};

export const everyOtherMonth: Story = {
	args: { expense: { ...defaultExpense, monthsInterval: 2 } },
};

export const distributed: Story = {
	args: {
		expense: { ...defaultExpense, monthsInterval: 12, isDistributed: true },
	},
};

export const distributedOverMonth: Story = {
	args: {
		expense: { ...defaultExpense, isDistributed: true },
	},
};
