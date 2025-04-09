import { Meta, StoryObj } from "@storybook/react";
import { PageLoading } from "./PageLoading";

const meta = {
	component: PageLoading,
} satisfies Meta<typeof PageLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const withMessage: Story = {
	args: { message: "This is a loading message" },
};
