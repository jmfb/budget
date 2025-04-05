import { Meta, StoryObj } from "@storybook/react";
import { SignInButton } from "./SignInButton";
import { fn } from "@storybook/test";

const meta = {
	component: SignInButton,
	args: {
		isDisabled: false,
		onClick: fn(),
	},
} satisfies Meta<typeof SignInButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const light: Story = { args: { type: "light" } };

export const lightDisabled: Story = {
	args: { type: "light", isDisabled: true },
};

export const dark: Story = { args: { type: "dark" } };

export const darkDisabled: Story = {
	args: { type: "light", isDisabled: true },
};
