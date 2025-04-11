import { Meta, StoryObj } from "@storybook/react";
import { Configure } from "./Configure";
import { makeStoreDecorator } from "~/decorators";

const meta = {
	component: Configure,
	decorators: [makeStoreDecorator()],
} satisfies Meta<typeof Configure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
