import { Meta, StoryObj } from "@storybook/react";
import { ExpenseTransaction } from "./ExpenseTransaction";
import { ITransaction } from "~/models";

const meta = {
	component: ExpenseTransaction,
	args: {
		transaction: {
			amount: 100,
			note: "This is the note",
			description: "Description of item",
			date: "2025-03-25",
		} as ITransaction,
	},
} satisfies Meta<typeof ExpenseTransaction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
