import { Meta, StoryObj } from "@storybook/react";
import { Category } from "./Category";
import { makeStoreDecorator } from "~/decorators";
import { fn } from "@storybook/test";

const meta = {
	component: Category,
	args: {
		category: "Tech",
		expenses: [
			{
				id: 1,
				year: 2024,
				categoryId: 2,
				name: "Internet",
				amount: 100,
				monthsInterval: 1,
				isDistributed: false,
			},
			{
				id: 1,
				year: 2024,
				categoryId: 2,
				name: "Streaming Service",
				amount: 150,
				monthsInterval: 1,
				isDistributed: false,
			},
		],
		onAddExpense: fn(),
		onEditExpense: fn(),
	},
	decorators: [makeStoreDecorator()],
} satisfies Meta<typeof Category>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
