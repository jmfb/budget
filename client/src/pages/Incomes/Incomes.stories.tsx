import { Meta, StoryObj } from "@storybook/react";
import { Incomes } from "./Incomes";
import { makeStoreDecorator } from "~/decorators";

const meta = {
	component: Incomes,
	args: {
		incomes: [
			{
				id: 1,
				year: 2024,
				name: "Income name",
				amount: 1000,
				weeksInterval: 2,
			},
			{
				id: 2,
				year: 2024,
				name: "Allowance",
				amount: 50,
				weeksInterval: 1,
			},
			{
				id: 3,
				year: 2024,
				name: "Bonus",
				amount: 15000,
				weeksInterval: 52,
			},
		],
	},
	decorators: [makeStoreDecorator()],
} satisfies Meta<typeof Incomes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const empty: Story = { args: { incomes: [] } };
