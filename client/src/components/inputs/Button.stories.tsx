import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
	component: Button,
	render(props) {
		return <Button {...props}>Example</Button>;
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const primary: Story = { args: { variant: "primary" } };

export const danger: Story = { args: { variant: "danger" } };

export const disabled: Story = { args: { isDisabled: true } };

export const processing: Story = {
	args: { isDisabled: true, isProcessing: true },
};
