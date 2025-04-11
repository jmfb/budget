import { Meta, StoryObj } from "@storybook/react";
import { Expenses } from "./Expenses";
import { makeStoreDecorator } from "~/decorators";

const meta = {
	component: Expenses,
	args: {
		expenses: [
			{
				id: 1,
				year: 2024,
				categoryId: 10,
				name: "Internet",
				amount: 100,
				monthsInterval: 1,
				isDistributed: false,
			},
			{
				id: 1,
				year: 2024,
				categoryId: 10,
				name: "Streaming Service",
				amount: 150,
				monthsInterval: 1,
				isDistributed: false,
			},
			{
				id: 3,
				year: 2024,
				categoryId: 11,
				name: "Birthdays",
				amount: 1000,
				monthsInterval: 12,
				isDistributed: true,
			},
		],
		categoryById: {
			[10]: { id: 10, name: "Home" },
			[11]: { id: 11, name: "Family" },
		},
	},
	decorators: [makeStoreDecorator()],
} satisfies Meta<typeof Expenses>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
