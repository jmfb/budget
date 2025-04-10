import { Meta, StoryObj } from "@storybook/react";
import { Income } from "./Income";
import { makeStoreDecorator } from "~/decorators";
import { fn } from "@storybook/test";

const defaultIncome = {
	id: 1,
	year: new Date().getFullYear(),
	name: "Work Income",
	amount: 5000,
	weeksInterval: 2,
};

const meta = {
	component: Income,
	args: {
		income: defaultIncome,
		onEdit: fn(),
	},
	decorators: [makeStoreDecorator()],
} satisfies Meta<typeof Income>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const weekly: Story = {
	args: { income: { ...defaultIncome, weeksInterval: 1 } },
};

export const yearly: Story = {
	args: { income: { ...defaultIncome, weeksInterval: 52 } },
};
