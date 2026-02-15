import { Meta, StoryObj } from "@storybook/react";
import { FileInput } from "./FileInput";
import { fn } from "@storybook/test";

const meta = {
	component: FileInput,
	args: {
		accept: "*.csv",
		children: "Upload something",
		onClick: fn(),
	},
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const disabled: Story = { args: { isDisabled: true } };

export const processing: Story = {
	args: { isProcessing: true, isDisabled: true },
};
