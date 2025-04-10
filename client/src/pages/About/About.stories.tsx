import { Meta, StoryObj } from "@storybook/react";
import { About } from "./About";
import { makeRouterDecorator } from "~/decorators";

const meta = {
	component: About,
	decorators: [makeRouterDecorator()],
} satisfies Meta<typeof About>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
