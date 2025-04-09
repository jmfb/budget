import { Meta, StoryObj } from "@storybook/react";
import { LoadingIcon } from "./LoadingIcon";

const meta = {
	component: LoadingIcon,
} satisfies Meta<typeof LoadingIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
