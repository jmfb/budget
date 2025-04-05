import { Meta, StoryObj } from "@storybook/react";
import { SignIn } from "./SignIn";
import { fn } from "@storybook/test";

const meta = {
	component: SignIn,
	args: {
		isSigningIn: false,
		onClickSignIn: fn(),
	},
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const signingIn: Story = { args: { isSigningIn: true } };
