import { Meta, StoryObj } from "@storybook/react";
import { Category } from "./Category";
import { fn } from "@storybook/test";

const meta = {
	component: Category,
	args: {
		category: {
			id: 1,
			name: "Groceries",
		},
		onClick: fn(),
	},
} satisfies Meta<typeof Category>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
